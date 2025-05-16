import "../css/callToAction.css"
import Link from "next/link";

const CallToAction = () => {
    return (
        <section className="call_to_action">
            <div className="information">
              <h1>
              Stay Powered Anywhere!
              </h1>
              <p>
              Never run out of battery again. Rent your power bank today and stay connected wherever you go!
              </p>
              <Link href="../SingUp">
              join us now
              </Link>
            </div>
            <img src="../assets/images/call_to_action.jpg" alt="" />
        </section>
    );
}

export default CallToAction;