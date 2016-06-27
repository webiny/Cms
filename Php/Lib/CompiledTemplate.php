<?php
namespace Apps\Cms\Php\Lib;

use Apps\Cms\Php\Entities\Template;
use Apps\Core\Php\DevTools\Exceptions\AppException;

class CompiledTemplate
{
    protected $template;
    protected $templateContent;
    protected $compiledTemplate;


    public function __construct(Template $template)
    {
        $this->template = $template;
        $this->templateContent = json_decode($template->content, true);
        if (!$this->templateContent) {
            throw new AppException('Unable to parse the template structure.');
        }

        $this->compile();
    }

    public function getTemplateDefinition()
    {
        return $this->compiledTemplate;
    }

    public function getZones()
    {
        return $this->compiledTemplate['zones'];
    }

    public function getModules()
    {
        return $this->compiledTemplate['modules'];
    }

    public function getMeta()
    {
        return $this->compiledTemplate['meta'];
    }

    protected function compile()
    {
        $layout = json_decode($this->template->layout->content, true);
        if (!$layout) {
            throw new AppException('Unable to parse the parent layout structure.');
        }

        $layoutData['name'] = $layout['name'];
        if (isset($layoutData['description'])) {
            $layoutData['description'] = $layout['description'];
        }

        $templateData['name'] = $this->template->name;
        if (isset($this->templateContent['description'])) {
            $templateData['description'] = $this->templateContent['description'];
        }

        $this->compiledTemplate = array_merge_recursive($layout, $this->templateContent);
        unset($this->compiledTemplate['name']);
        $this->compiledTemplate['layout'] = $layoutData;
        $this->compiledTemplate['template'] = $layoutData;
    }

}