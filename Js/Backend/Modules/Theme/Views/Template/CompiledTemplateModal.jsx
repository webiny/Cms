import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class CompiledTemplateModal extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);
    }

    render() {
        const templateProps = {
            ui: 'compiledTemplate',
            loadModel: () => {
                return new Webiny.Api.Endpoint('/entities/cms/template').get('compile/' + this.props.data.id).then(apiResponse => {
                    return apiResponse.getData();
                });
            }
        };

        return (
            <Ui.Modal.Dialog ref="dialog">
                <Ui.Modal.Header title="Compiled Template"/>
                <Ui.Modal.Body>
                    <Ui.Form.Container {...templateProps}>
                        {(model, container) => (
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={12}>
                                    <Ui.Form.Error/>
                                    <Ui.CodeEditor name="content" validate="required"
                                                   mode="javascript" readOnly="true"/>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                        )}
                    </Ui.Form.Container>
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="primary" label="Close" onClick={this.hide}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default CompiledTemplateModal;