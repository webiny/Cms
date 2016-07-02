import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ThemeModalForm extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);
    }

    render() {
        const formProps = {
            ui: 'themeModalForm',
            api: '/entities/cms/theme',
            fields: '*',
            defaultModel: _.merge({type: 'custom'}, {theme: Webiny.Router.getParams('id')}, this.props.data),
            onSubmitSuccess: () => {
                this.refs.dialog.hide().then(() => {
                    this.props.showView('themeListView');
                });
            }
        };

        return (
            <Ui.Modal.Dialog ref="dialog">
                <Ui.Modal.Header title="New Theme"/>
                <Ui.Modal.Body>
                    <Ui.Form.Container {...formProps}>
                        {() => (
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={6}>
                                    <Ui.Input label="Name" name="name" validate="required"/>
                                    <Ui.Input label="Url" name="url" validate="url"/>
                                    <Ui.Input label="Version" name="version" validate="required"/>
                                </Ui.Grid.Col>
                                <Ui.Grid.Col all={6}>
                                    <Ui.Input label="Author name" name="authorName" validate="required"/>
                                    <Ui.Input label="Author email" name="authorEmail" validate="email"/>
                                </Ui.Grid.Col>

                                <Ui.Grid.Col all={12}>
                                    <Ui.Textarea label="Description" name="description"/>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                        )}
                    </Ui.Form.Container>
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="secondary" label="Cancel" onClick={this.hide}/>
                    <Ui.Button type="primary" label="Save theme" onClick={this.ui('themeModalForm:submit')}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default ThemeModalForm;