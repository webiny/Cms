import Webiny from 'Webiny';
import ThemeModalForm from './ThemeModalForm';
import ThemeExportModal from './ThemeExportModal';
import ThemeImportModal from './ThemeImportModal';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class ThemeList extends Webiny.Ui.View {
}

ThemeList.defaultProps = {

    renderer() {
        const listProps = {
            api: '/entities/cms/theme',
            fields: '*',
            searchFields: 'name',
            connectToRouter: true,
            ui: 'themeList'
        };

        const searchProps = {
            placeholder: 'Search by theme name',
            name: '_searchQuery'
        };

        return (
            <Ui.ViewSwitcher.Container>
                <Ui.ViewSwitcher.View view="themeListView" defaultView>
                    {showView => (
                        <Ui.View.List>
                            <Ui.View.Header title="Themes">
                                <Ui.Button type="primary" align="right"
                                           onClick={showView('themeModalFormView')} icon="icon-plus-circled">
                                    New Theme
                                </Ui.Button>
                                <Ui.Button type="secondary" align="right"
                                           onClick={showView('themeImportView')} icon="icon-upload">
                                    Import Theme
                                </Ui.Button>
                            </Ui.View.Header>
                            <Ui.View.Body>
                                <Ui.List.ApiContainer {...listProps}>
                                    <Ui.List.FormFilters>
                                        {(applyFilters) => (
                                            <Ui.Input {...searchProps} onEnter={applyFilters()}/>
                                        )}
                                    </Ui.List.FormFilters>
                                    <Table.Table>
                                        <Table.Row>
                                            <Table.Field name="name" align="left" label="Name" sort="name"
                                                         route="Cms.Theme.LayoutList"/>
                                            <Table.TimeAgoField name="createdOn" align="left" label="Created On"
                                                                sort="createdOn"/>
                                            <Table.Actions>
                                                <Table.Action label="Export"
                                                              onClick={showView('themeExportView')}/>
                                                <Table.EditAction label="Edit"
                                                                  onClick={showView('themeModalFormView')}/>
                                                <Table.DeleteAction/>
                                            </Table.Actions>
                                        </Table.Row>
                                        <Table.Footer/>
                                    </Table.Table>
                                    <Ui.List.Pagination/>
                                </Ui.List.ApiContainer>
                            </Ui.View.Body>
                        </Ui.View.List>
                    )}
                </Ui.ViewSwitcher.View>

                <Ui.ViewSwitcher.View view="themeModalFormView" modal>
                    {(showView, data) => <ThemeModalForm ui="themeModal" {...{showView, data}} />}
                </Ui.ViewSwitcher.View>

                <Ui.ViewSwitcher.View view="themeExportView" modal>
                    {(showView, data) => <ThemeExportModal ui="themeExportModal" {...{showView, data}} />}
                </Ui.ViewSwitcher.View>

                <Ui.ViewSwitcher.View view="themeImportView" modal>
                    {(showView, data) => <ThemeImportModal ui="themeImportModal" {...{showView}} />}
                </Ui.ViewSwitcher.View>

            </Ui.ViewSwitcher.Container>

        );
    }
};

export default ThemeList;