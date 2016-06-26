import Webiny from 'Webiny';
import TemplateModalForm from './TemplateModalForm';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class TemplateList extends Webiny.Ui.View {
}

TemplateList.defaultProps = {

    renderer() {
        const listProps = {
            api: '/entities/cms/template',
            fields: '*',
            searchFields: 'name',
            connectToRouter: true,
            ui: 'templateList',
            query: {
                layout: Webiny.Router.getParams('id'),
                '_sort': 'name'
            },
            perPage: 1000
        };

        const layoutProps = {
            api: '/entities/cms/layout',
            url: Webiny.Router.getParams('id'),
            ui: 'layout',
            fields: '*, theme.*'
        };

        const searchProps = {
            placeholder: 'Search by template name',
            name: '_searchQuery'
        };

        return (
            <Ui.ViewSwitcher.Container>
                <Ui.ViewSwitcher.View view="templateListView" defaultView>
                    {showView => (
                        <view>

                            <Ui.Data {...layoutProps} >
                                {data => (
                                    <Ui.View.List>
                                        <Ui.View.Header title="Templates"
                                                        description={'Layout: ' + _.get(data, 'theme.name') + ' / ' + _.get(data, 'name')}>

                                            <Ui.Button type="primary" align="right"
                                                       onClick={showView('templateModalFormView')}
                                                       icon="icon-plus-circled">
                                                New Template
                                            </Ui.Button>
                                            <Ui.Link type="default" align="right" route="Cms.Theme.LayoutList"
                                                     params={{'id':_.get(data, 'theme.id')}}>
                                                Back to Layouts
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
                                                                              onClick={showView('templateModalFormView')}/>
                                                            <Table.Action label="View Compiled Template"
                                                                              onClick={showView('templateModalFormView')}/>
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

                <Ui.ViewSwitcher.View view="templateModalFormView" modal>
                    {(showView, data) => <TemplateModalForm ui="templateModal" {...{showView, data}} />}
                </Ui.ViewSwitcher.View>

            </Ui.ViewSwitcher.Container>

        );
    }
};

export default TemplateList;