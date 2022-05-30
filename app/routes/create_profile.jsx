import { json, redirect } from "@remix-run/node";
import {  Link, Outlet } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import img from "~/assets/img.jpeg";
import { getSession } from "./session.js";
import arrow from "~/assets/rightArrow.png";
export async function loader({ request }) {
    const session = await getSession(request.headers.get("Cookie"));
    const db = await connectDb();
    if(!session.get("userId")){
        return redirect("/register");
    }
    return json({
      userId: await db.models.Profile.findById(session.get("userId")),
    });
  }
export default function CreateProfile() {
    return(
        <div>
               <div className="mb-4 pb-4 border-b flex justify-between" style={
                   {
                       background:"white"
                   }
               }>
                   <img src={img} alt="img" className="img"></img>
                   <div >
                        <div className="chenarCreateProfile">
                            <i className="textCreateProfile">Thank you! Thanks for signing up. Welcome to our community. We are happy to have you on board.</i>
                        </div>
                        <button
                            className="createProfile"
                            type="submit"
                            style={{
                                marginTop:"5%",
                                marginLeft:"20%",marginTop:"5%"
                            }}
                            >
                           <Link to={'profile'} activeClassName="active"><i>Create your profile</i></Link>
                        </button>
                   </div>
               </div>
               <div className="w-full">
                    <Outlet />
                </div>
        </div>
    )
}