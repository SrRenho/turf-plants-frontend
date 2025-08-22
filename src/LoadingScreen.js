import Dots from "./Dots";
import Footer from "./Footer";


export default function LoadingScreen() {
    return (
        <>
        <main style={{textAlign: 'center', marginTop: '50px'}}>
            Server loading<Dots /><br/>
            No one joined for a while so the server was sleeping.<br/>
            Free tier hosting servers may take a minute to wake up!<br/>
            Thanks for your patience!
            <br/>
            <br/>
            Turf Plants
        </main>
        <Footer />
        </>
    );
}