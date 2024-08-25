import style from "../styles/loader.module.css"

export default function Loader(){
    return(
        <div className={style.sea}>
            <div className={style.circleWrapper}>
                <div className={style.bubble}></div>
                <div className={style.submarineWrapper}>
                    <div className={style.submarineBody}>
                        <div className={style.window}></div>
                        <div className={style.engine}></div>
                        <div className={style.light}></div>
                    </div>
                    <div className={style.helix}></div>
                    <div className={style.hat}>
                    <div className={style.ledsWrapper}>
                        <div className={style.periscope}></div>
                        <div className={style.leds}></div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
