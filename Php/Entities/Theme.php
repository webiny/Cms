<?php
namespace Apps\Cms\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;

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
class Theme extends EntityAbstract
{
    use DevToolsTrait;

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
    }

    public function export(Theme $t)
    {
        // todo
    }

    public function import()
    {
        // todo
    }
}
