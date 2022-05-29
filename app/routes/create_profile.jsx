import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useCatch, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import img from "~/assets/img.png";
import user from "~/assets/User.png";
import { getSession, commitSession } from "./session.js";

export async function action({ request }) {
    const db = await connectDb();
    const form = await request.formData();
    const description = form.get("description").trim();
    const skills = form.get("skills").trim();
    const interests = form.get("interests").trim();
    const linkedin = form.get("linkedin").trim();
    const portofolio = form.get("portofolio").trim();

}
export async function loader({ request }) {
    const session = await getSession(request.headers.get("Cookie"));
    const db = await connectDb();
    return json({
      userId: await db.models.User.findById(session.get("userId")),
    });
  }
export default function CreateProfile() {
    const { users } = useLoaderData();
    const actionData = useActionData();
    return(
        <div>
            {!users?(
               <>
               <div className="mb-4 pb-4 border-b flex justify-between" style={
                   {
                       background:"white"
                   }
               }>
                   <img src={img} alt="img" className="img"></img>
                   <div className="profile" style={{background:"#9F97D6"}}>
                       <i >Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."</i>
                   </div>
               </div>
               <div class="input-container" style={
                   {
                       margin:"3%"
                   }
               }>
                   <img src={user} alt="img" style={
                       {
                       width:"2%",
                       height:"2%",
                       marginRight:"2%"
                       }
                   }></img>
                   <i style={
                   {
                       marginTop:"0.3%"
                   }}>CREATE PROFILE</i>
               </div>
               <Form method="post">
                   <div className="profile">
                       <textarea placeholder="Description" style={{
                           width:"100%",
                           height:"100px",
                           padding:"15px"
                       }} name="description"></textarea>
                       <input type="text" placeholder="Skills" className="profileInput" name="skills"></input>
                       <br></br>
                       <input type="text" placeholder="Interests" className="profileInput" name="interests"></input>
                       <br></br>
                       <input type="text" placeholder="LinkedIn profile (optional)" className="profileInput" name="linkedin"></input>
                       <br></br>
                       <input type="text" placeholder="Portofolio (optional)" className="profileInput" name="portofolio"></input>
                       <br></br>
                       <button
                       className="createProfile"
                       type="submit">
                       Create
                       </button>
                   </div>
               </Form>
               </>
            ): 
               <>
                    <h1>You are not connected!</h1>
               </>
            }
        </div>
    )
}