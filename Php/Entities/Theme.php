<?php
namespace Apps\Cms\Php\Entities;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Apps\Core\Php\DevTools\Exceptions\AppException;

/**
 * Class Theme
 *
 * @property string $name
 * @property string $url
 * @property string $version
 * @property string $authorName
 * @property string $authorEmail
 * @property string $description
 *
 * @package Apps\Core\Php\Entities
 *
 */
class Theme extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'CmsTheme';
    protected static $entityMask = '{name}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('name')->char()->setRequired()->setToArrayDefault();
        $this->attr('url')->char()->setValidators(['url'])->setToArrayDefault();
        $this->attr('version')->char()->setRequired()->setToArrayDefault();
        $this->attr('description')->char()->setToArrayDefault();
        $this->attr('authorName')->char()->setRequired()->setToArrayDefault();
        $this->attr('authorEmail')->char()->setValidators(['email'])->setToArrayDefault();

        $this->api('get', 'export-theme/{theme}', function (Theme $theme) {
            return $this->exportTheme($theme);
        });

        $this->api('post', 'import-theme', function () {
            return $this->importTheme();
        });
    }

    public function exportTheme(Theme $theme)
    {
        $exportedTheme = [
            'name'        => $theme->name,
            'url'         => $theme->url,
            'version'     => $theme->version,
            'description' => $theme->description,
            'author'      => [
                'name'  => $theme->authorName,
                'email' => $theme->authorEmail
            ],
            'layouts'     => []
        ];

        // attach layouts
        $layouts = Layout::find(['theme' => $theme->id]);
        if ($layouts->totalCount() > 0) {
            foreach ($layouts as $layout) {
                // attach layout templates
                $templates = Template::find(['layout' => $layout->id]);
                $layoutContent = json_decode($layout->content, true);
                if ($templates->totalCount() > 0) {
                    foreach ($templates as $template) {
                        $layoutContent['templates'][] = json_decode($template->content, true);
                    }
                }

                $exportedTheme['layouts'][] = $layoutContent;
            }
        }

        return ['content' => json_encode($exportedTheme, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)];
    }

    public function importTheme()
    {
        $content = $this->wRequest()->payload('content');
        $content = json_decode($content, true);
        if (empty($content)) {
            throw new AppException('Unable to parse theme JSON structure.');
        }


        // valid keys
        $keys = [
            'name'        => true,
            'url'         => false,
            'version'     => false,
            'description' => false,
            'author'      => false,
            'layouts'     => true
        ];

        // check that all defined keys are part of the layout structure
        foreach ($content as $k => $v) {
            if (!isset($keys[$k])) {
                throw new AppException(sprintf('Unknown key "%s".', $k));
            }
        }

        // check that required elements are present
        $themeEntity = new Theme();
        foreach ($keys as $k => $required) {
            if ($required && empty($content[$k])) {
                throw new AppException(sprintf('Theme key "%s" is required.', $k));
            }
            if ($k !== 'layouts' && $k !== 'author') {
                $themeEntity->{$k} = $content[$k];
            }
        }

        $themeEntity->authorName = $content['author']['name'];
        $themeEntity->authorEmail = $content['author']['email'];

        // check for layouts
        if (empty($content['layouts'])) {
            throw new AppException('Theme needs to have at least one layout defined.');
        }

        // save the theme
        $themeEntity->save();

        // validate layouts and templates
        $savedEntities = [];
        $savedEntities[] = $themeEntity;
        foreach ($content['layouts'] as $layout) {
            try {
                if (empty($layout['templates'])) {
                    throw  new AppException(sprintf('Layout "%s" doesn\'t have any templates defined'),
                        $layout['name']);
                }
                $templates = $layout['templates'];
                unset($layout['templates']);
                $layoutContent = json_encode($layout, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
                $layoutEntity = new Layout();
                $layoutEntity->content = $layoutContent;
                $layoutEntity->theme = $themeEntity;
                $layoutEntity->save();
                $savedEntities[] = $layoutEntity;

                foreach ($templates as $template) {
                    $template = json_encode($template, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
                    $templateEntity = new Template();
                    $templateEntity->content = $template;
                    $templateEntity->layout = $layoutEntity;
                    $templateEntity->save();

                    $savedEntities[] = $templateEntity;
                }

            } catch (\Exception $e) {

                // revert back all the saved stuff
                foreach ($savedEntities as $se) {
                    $se->delete();
                }

                throw $e;
            }
        }

        return $themeEntity;

    }
}
