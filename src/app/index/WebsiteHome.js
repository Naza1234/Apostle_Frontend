import CallToAction from "../components/CallToAction";
import { Footer, Navigation } from "../components/landing Page Navigation  And Footer";
import { HeroSection, HowItWorks, IntroVideo, Location, UserReviews } from "./Components";

export default function WebsiteHome() {
    return (
        <>
            <Navigation/>


            <HeroSection/>
            <IntroVideo/>
            <HowItWorks/>
            <Location/>
            <UserReviews/>
            <CallToAction/>

            <Footer/>
        </>
    );
}