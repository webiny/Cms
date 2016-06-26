<?php
namespace Apps\Cms\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;
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

        $this->attr('name')->char()->setRequired()->setToArrayDefault();
        $this->attr('content')->char()->setRequired()->setToArrayDefault()->onSet(function ($content) {

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
            $contentObject = json_decode($content, true);
            if (!$contentObject) {
                throw new EntityException('Layout content is not a proper JSON object.');
            }

            // check that all defined keys are part of the layout structure
            foreach ($contentObject as $k => $v) {
                if (!isset($keys[$k])) {
                    throw new EntityException(sprintf('Unknown key "%s".', $k));
                }
            }

            // check that required elements are present
            foreach ($keys as $k => $required) {
                if($required && empty($contentObject[$k])){
                    throw new EntityException(sprintf('Layout key "%s" is required.', $k));
                }
            }

            // extract and set the layout name
            $this->name = $contentObject['name'];

            return $content;
        })->setAfterPopulate();

        $theme = '\Apps\Cms\Php\Entities\Theme';
        $this->attr('theme')->many2one('Theme')->setEntity($theme)->setValidators('required');
    }
}
