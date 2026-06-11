import { Modal, ModalBody } from "@themesberg/react-bootstrap";

const SalespopModal = (props) => {
    if(!props.open){
        return null
    }
    return(
        <>
        <Modal>
            <ModalBody>
                Hi
            </ModalBody>
        </Modal>
        </>
    );
}

export default SalespopModal;