import { Outlet } from "react-router-dom";
import { Header, Navigation, TopHeader, Footer, ScrollToTop } from "../../components";

const Public = () => {
    return (
        <div className="w-full flex min-h-screen flex-col items-center">
            <ScrollToTop />
            <TopHeader />
            <Header />
            <Navigation />
            <div className="w-main">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Public;
