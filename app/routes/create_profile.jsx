import { json, redirect } from "@remix-run/node";
import { Form, Link, Outlet, useActionData, useCatch, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import img from "~/assets/img.png";
import { getSession, commitSession } from "./session.js";
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
                   <div>
                        <div className="profile" style={{background:"#9F97D6"}}>
                            <i >Thank you!

Thanks for signing up. Welcome to our community. We are happy to have you on board.</i>
                        </div>
                        <Link to={'profile'} activeClassName="active" className="createAccount">Create your profile</Link>
                   </div>
    
                  
               </div>
               <div className="w-full">
                    <Outlet />
                </div>
        </div>
    )
}