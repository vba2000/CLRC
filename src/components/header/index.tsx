import {FunctionalComponent, h, RenderableProps} from 'preact';
import {Link} from 'preact-router/match';
import style from './style.css';

type Props = {
    user: string;
};

const Header: FunctionalComponent<Props> = (props) => {
    return (
        <header class={style.header}>
            <Link href="/"><h1>Comfort Lab RAK Invest</h1></Link>
            {
                props.user ?
                    <nav>
                        <Link activeClassName={style.active} href="/invest">
                            {props.user}
                        </Link>
                    </nav> :
                    <nav>
                        <Link activeClassName={style.active} href="/login">
                            Login
                        </Link>
                    </nav>
            }
        </header>
    );
};

export default Header;
