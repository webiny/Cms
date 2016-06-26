<?php
namespace Apps\Cms\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Apps\Core\Php\DevTools\Exceptions\AppException;
use Webiny\Component\Entity\EntityException;

/**
 * Class Template
 *
 * @property string $name
 * @property string $content
 * @property Layout $layout
 *
 * @package Apps\Core\Php\Entities
 *
 */
class Template extends EntityAbstract
{
    use DevToolsTrait;

    protected static $entityCollection = 'CmsTemplate';
    protected static $entityMask = '{name}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('name')->char()->setToArrayDefault();
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

            // extract and set the layout name
            $this->name = $contentObject['name'];

            return $content;
        })->setAfterPopulate();

        $layout = '\Apps\Cms\Php\Entities\Layout';
        $this->attr('layout')->many2one('Layout')->setEntity($layout)->setValidators('required');


        $this->api('get', 'compile', function (Template $template) {
            $this->compileTemplate($template);
        });

    }

    /**
     * Merges the template with the layout and returns the result as a JSON object.
     *
     * @param Template $t
     */
    public function compileTemplate(Template $t)
    {

        //todo

    }

}
