import styles from './index.module.css';
import useOutsideAlerter from '../../../helpers/useOutsideAlerter';
import { useRef } from 'react';

const CommonModal = (props) => {
    const { showModal } = props;
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, showModal);

    return (
        <div className={styles.overlayContainer}>
            <div className={styles.container + " animate__animated animate__slideInUp animate__faster"} ref={wrapperRef} >
                {props.children}
            </div>
        </div >
    );
};

export default CommonModal;