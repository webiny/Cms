import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class LayoutModalForm extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);
    }

    render() {
        const formProps = {
            ui: 'layoutModalForm',
            api: '/entities/cms/layout',
            fields: '*',
            defaultModel: _.merge({}, {theme: Webiny.Router.getParams('id')}, this.props.data),
            onSubmitSuccess: this.props.showView('layoutListView')
        };

        return (
            <Ui.Modal.Dialog ref="dialog">
                <Ui.Modal.Header title="Layout"/>
                <Ui.Modal.Body>
                    <Ui.Form.Container {...formProps}>
                        {() => (
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={12}>
                                    <Ui.Form.Error/>
                                    <Ui.CodeEditor label="Content" name="content" validate="required" mode="javascript" />
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                        )}
                    </Ui.Form.Container>
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="secondary" label="Cancel" onClick={this.hide}/>
                    <Ui.Button type="primary" label="Save layout" onClick={this.ui('layoutModalForm:submit')}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default LayoutModalForm;