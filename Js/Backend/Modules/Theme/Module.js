import Webiny from 'Webiny';
import Views from './Views/Views';

class CmsTheme extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('CMS', [
                new Menu('Themes', 'Cms.Theme.ThemeList')
            ], 'icon-bell')
        );

        this.registerRoutes(
            new Webiny.Route('Cms.Theme.ThemeList', '/cms/themes', Views.ThemeList, 'CMS - Themes'),
            new Webiny.Route('Cms.Theme.LayoutList', '/cms/theme/layout/:id', Views.LayoutList, 'CMS - Layouts')
        );
    }
}

export default CmsTheme;