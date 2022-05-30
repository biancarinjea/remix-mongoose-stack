import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import user from "~/assets/User.png";
import { requireUserSession } from "~/routes/session.js";


export async function action({request}){
    const session = await requireUserSession(request);
    const db = await connectDb();
    const form = await request.formData();
    const description = form.get("description");
    const skills = form.get("skills");
    const interests = form.get("interests");
    const linkedin = form.get("linkedin");
    const portofolio = form.get("portofolio");
    const fullname = form.get("fullname");
    const age = form.get("age");
    const location = form.get("location");
    const jobType = form.get("jobType");
    const phoneNumber = form.get("phoneNumber");
    const email = form.get("email");
    const profilePicture = form.get("profilePicture");
    try{
        const profile = await db.models.Profile.create({
            email:email,
            phoneNumber:phoneNumber,
            jobType:jobType,
            location:location,
            age:age,
            fullname: fullname,
            description: description,
            skills: skills,
            interests: interests,
            linkedin: linkedin,
            portofolio: portofolio,
            userId: session.get("userId"),
            profilePicture: profilePicture,
            createdAt: new Date().toDateString()
        });
        if(profile){
            return redirect(`/profileView/${profile._id}`);
        }else{
            return json({ error: "Profile cannot create"}, { status: 400 });
        }
    }catch(error){
        return json(
            {
              error:
                error.message ??
                error.errors?.map((error) => error.message).join(", "),
            },
            { status: 400 }
          );
    }
}
export default function Profile(){
    const actionData = useActionData();
    return(
        <div>
              <div class="input-container" style={{width:"65%",marginLeft:"22%"}}>
                   <img src={user} alt="img" style={
                       {
                       width:"2%",
                       height:"2%",
                       marginRight:"2%"
                       }
                   }></img>
                   <div>
                   <i style={
                   {
                       marginTop:"0.3%"
                   }}>CREATE PROFILE</i>
                   <div className="border" style={{width:"500px"}}></div>
                   </div>
               </div>
               <Form method="post">
                   <div className="insertProfile">
                       <input type="text" placeholder="Profile picture(required)" className="insertField" name="profilePicture" ></input>
                       <br></br>
                       <input type="text" placeholder="Full Name(required)" className="insertField" name="fullname" ></input>
                       <br></br>
                       <input type="number" placeholder="Age(required)" className="insertField" name="age" min="18" max="65" style={
                           {
                               width:"39%"
                           }
                       }></input>
                        <br></br>
                         <input type="text" placeholder="Location(required)" className="insertField" name="location"></input>
                       <textarea placeholder="Description(required)" className="insertField" style={{
                           width:"100%",
                           height:"100px",
                           padding:"15px"
                       }} name="description"></textarea>
                       <input type="text" placeholder="Skills(required)" className="insertField" name="skills"></input>
                       <br></br>
                       <input type="text" placeholder="Interests(required)" className="insertField" name="interests"></input>
                       <br></br>
                       <select id="cars" name="jobType" className="insertField" text="test">
                            <option value="" disabled selected>Looking for(required)</option>
                            <option value="internship">Internship</option>
                            <option value="job">Job</option>
                        </select>
                        <br></br>
                       <input type="text" placeholder="LinkedIn profile (optional)" className="insertField" name="linkedin"></input>
                       <br></br>
                       <input type="text" placeholder="Portofolio (optional)" className="insertField" name="portofolio"></input>
                       <br></br>
                       <input type="tel" placeholder="Phone number (required)" className="insertField" name="phoneNumber"></input>
                       <br></br>
                       <input type="tel" placeholder="Email address (required)" className="insertField" name="email"></input>
                       <br></br>
                       {actionData?.error ? (
                        <p className="text-red-500 font-bold my-3">{actionData.error}</p>
                        ) : null}
                       <button
                       className="createProfile"
                       type="submit">
                       Create
                       </button>
                   </div>
               </Form>
        </div>
    );
}
export function CatchBoundary() {
    const caught = useCatch();
    return (
      <div className="w-full p-8 bg-white">
        <div>
          <h2>
            <b>{caught.data}</b>
          </h2>
          <p>
            This page is unavailable. Please try again when you regain
            connectivity.
          </p>
        </div>
      </div>
    );
  }