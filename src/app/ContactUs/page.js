import CallToAction from "../components/CallToAction";
import { Footer, Navigation } from "@/app/components/landing Page Navigation  And Footer";
import { ContactUs, FAQsSection } from "./Components";


export default function() {
    return (
        <>
        <Navigation/>

            <ContactUs/>
            <FAQsSection/>
            <CallToAction/>

        <Footer/>
        </>
    );
}