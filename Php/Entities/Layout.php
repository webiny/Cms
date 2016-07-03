<?php
namespace Apps\Cms\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Apps\Core\Php\DevTools\Exceptions\AppException;
use Webiny\Component\Entity\EntityException;

/**
 * Class Layout
 *
 * @property string $name
 * @property string $content
 * @property Theme  $theme
 *
 * @package Apps\Core\Php\Entities
 *
 */
class Layout extends EntityAbstract
{
    use DevToolsTrait;

    protected static $entityCollection = 'CmsLayout';
    protected static $entityMask = '{name}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('name')->char()->setToArrayDefault();
        $this->attr('content')->char()->setRequired()->setToArrayDefault()->onSet(function ($content) {

            try {
                $this->validateJson($content);
            } catch (\Exception $e) {
                throw $e;
            }

            // extract and set the layout name
            $contentObject = json_decode($content, true);
            $this->name = $contentObject['name'];

            return $content;
        })->setAfterPopulate();

        $theme = '\Apps\Cms\Php\Entities\Theme';
        $this->attr('theme')->many2one()->setEntity($theme)->setValidators('required');
    }

    public function validateJson($json)
    {
        // validate that the required layout keys are defined
        $keys = [
            'name'        => true,
            'description' => false,
            'filename'    => false,
            'zones'       => false,
            'modules'     => false,
            'meta'        => false
        ];

        // check json object
        $contentObject = json_decode($json, true);
        if (!$contentObject) {
            throw new AppException('Layout content is not a proper JSON object.', 'INVALID_JSON');
        }

        // check that all defined keys are part of the layout structure
        foreach ($contentObject as $k => $v) {
            if (!isset($keys[$k])) {
                throw new AppException(sprintf('Unknown key "%s".', $k));
            }
        }

        // check that required elements are present
        foreach ($keys as $k => $required) {
            if ($required && empty($contentObject[$k])) {
                throw new AppException(sprintf('Layout key "%s" is required.', $k));
            }
        }

        return true;
    }
}
