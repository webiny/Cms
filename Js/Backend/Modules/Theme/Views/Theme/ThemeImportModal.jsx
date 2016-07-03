import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ThemeImportModal extends Webiny.Ui.ModalComponent {

    render() {
        const themeProps = {
            ui: 'importTheme',
            api: '/entities/cms/theme/import-theme',
            fields: '*',
            onSubmitSuccess: () => {
                this.refs.dialog.hide().then(() => {
                    this.props.showView('themeListView');
                    this.ui('themeList').loadData();
                });
            }
        };

        return (
            <Ui.Modal.Dialog ref="dialog">
                <Ui.Modal.Header title="Import Theme"/>
                <Ui.Modal.Body>
                    <Ui.Form.Container {...themeProps}>
                        {(model, container) => (
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={12}>
                                    <Ui.Form.Error/>
                                    <Ui.CodeEditor
                                        name="content"
                                        validate="required"
                                        mode="javascript"
                                        description="Paste your theme JSON file into the box"
                                    />
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                        )}
                    </Ui.Form.Container>
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="secondary" label="Cancel" onClick={this.hide}/>
                    <Ui.Button type="primary" label="Save theme" onClick={this.ui('importTheme:submit')}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default ThemeImportModal;