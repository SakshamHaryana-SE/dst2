import styles from './index.module.scss';

const OptionCard = (props) => {
    const { icon, title, onClick } = props;
    return (
        <div className={styles.cardContainer} onClick={onClick}>
            {icon}
            <div>{title}</div>
        </div>
    );
};

export default OptionCard;