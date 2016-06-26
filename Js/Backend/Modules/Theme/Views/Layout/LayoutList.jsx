import Webiny from 'Webiny';
import LayoutModalForm from './LayoutModalForm';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class LayoutList extends Webiny.Ui.View {
}

LayoutList.defaultProps = {

    renderer() {
        const listProps = {
            api: '/entities/cms/layout',
            fields: '*',
            searchFields: 'name',
            connectToRouter: true,
            ui: 'layoutList',
            query: {
                theme: Webiny.Router.getParams('id'),
                '_sort': 'name'
            },
            perPage: 1000
        };

        const layoutProps = {
            api: '/entities/cms/theme',
            url: Webiny.Router.getParams('id'),
            ui: 'layout'
        };

        const searchProps = {
            placeholder: 'Search by layout name',
            name: '_searchQuery'
        };

        return (
            <Ui.ViewSwitcher.Container>
                <Ui.ViewSwitcher.View view="layoutListView" defaultView>
                    {showView => (
                        <view>

                            <Ui.Data {...layoutProps} >
                                {data => (
                                    <Ui.View.List>
                                        <Ui.View.Header title={'Layouts (' + _.get(data, 'name') + ')'}>

                                            <Ui.Button type="primary" align="right"
                                                       onClick={showView('layoutModalFormView')}
                                                       icon="icon-plus-circled">
                                                New Layout
                                            </Ui.Button>
                                            <Ui.Link type="default" align="right" route="Cms.Theme.ThemeList">
                                                Back to Themes
                                            </Ui.Link>

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
                                                        <Table.Field name="name" align="left" label="Name" sort="name"/>
                                                        <Table.TimeAgoField name="createdOn" align="left"
                                                                            label="Created On"
                                                                            sort="createdOn"/>
                                                        <Table.Actions>
                                                            <Table.EditAction label="Edit"
                                                                              onClick={showView('layoutModalFormView')}/>
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
                            </Ui.Data>
                        </view>
                    )}
                </Ui.ViewSwitcher.View>

                <Ui.ViewSwitcher.View view="layoutModalFormView" modal>
                    {(showView, data) => <LayoutModalForm ui="layoutModal" {...{showView, data}} />}
                </Ui.ViewSwitcher.View>

            </Ui.ViewSwitcher.Container>

        );
    }
};

export default LayoutList;