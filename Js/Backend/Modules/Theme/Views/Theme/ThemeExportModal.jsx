import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ThemeExportModal extends Webiny.Ui.ModalComponent {

    renderDialog() {
        const themeProps = {
            ui: 'compiledTheme',
            loadModel: () => {
                return new Webiny.Api.Endpoint('/entities/cms/theme').get('export-theme/' + this.props.data.id).then(apiResponse => {
                    return apiResponse.getData();
                });
            }
        };

        return (
            <Ui.Modal.Dialog>
                <Ui.Modal.Header title="Export Theme"/>
                <Ui.Modal.Body>
                    <Ui.Form.Container {...themeProps}>
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

export default ThemeExportModal;