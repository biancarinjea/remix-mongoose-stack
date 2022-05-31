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
    let err="";
    if(profilePicture?.length == 0){
        err+="Please insert profile picture,";
    }else{
        err+=",";
    }
    if(description?.length == 0){
        err+="Please insert description,";
    }else{
        err+=",";
    }
    if(skills?.length == 0){
        err+="Please insert skills,";
    }else{
        err+=",";
    }
    if(interests?.length == 0){
        err+="Please insert interests,";
    }else{
        err+=",";
    }
    if(fullname?.length == 0){
        err+="Please insert fullname,";
    }else{
        err+=",";
    }
    if(age?.length == 0){
        err+="Please insert age,";
    }else{
        err+=",";
    }
    if(location?.length == 0){
        err+="Please insert location,";
    }else{
        err+=",";
    }
    if(jobType == "Looking for(required)"){
        err+="Please insert profile jobType,";
    }else{
        err+=",";
    }
    if(phoneNumber?.length == 0){
        err+="Please insert phoneNumber,";
    }else{
        err+=",";
    }
    if(email?.length == 0){
        err+="Please insert email,";
    }else{
        err+=",";
    }
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
               err
            },
            { status: 400 }
          );
    }
}
export default function Profile(){
    const actionData = useActionData();
    let profileError="";
    const err = actionData?.error.split(",");
    for(let e in err){
        if(String(e) == "Please insert profile picture"){
            profileError="Please insert profile picture";
        }
    }
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
                       {err?.at(0) == "Please insert profile picture" ? (
                        <p className="text-red-500 font-bold my-3">{err[0]}</p>
                        ) : null}
                       <input type="text" placeholder="Full Name(required)" className="insertField" name="fullname" ></input>
                       {err?.at(4) == "Please insert fullname" ? (
                        <p className="text-red-500 font-bold my-3">{err[4]}</p>
                        ) : null}
                       <input type="number" placeholder="Age(required)" className="insertField" name="age" min="18" max="65" style={
                           {
                               width:"39%"
                           }
                       }></input>
                         {err?.at(5) == "Please insert age" ? (
                        <p className="text-red-500 font-bold my-3">{err[5]}</p>
                        ) : null}
                         <input type="text" placeholder="Location(required)" className="insertField" name="location"></input>
                         {err?.at(6) == "Please insert location" ? (
                        <p className="text-red-500 font-bold my-3">{err[6]}</p>
                        ) : null}
                       <textarea placeholder="Description(required)" className="insertField" style={{
                           width:"100%",
                           height:"100px",
                           padding:"15px"
                       }} name="description"></textarea>
                       {err?.at(1) == "Please insert description" ? (
                        <p className="text-red-500 font-bold my-3">{err[1]}</p>
                        ) : null}
                       <input type="text" placeholder="Skills(required)" className="insertField" name="skills"></input>
                       {err?.at(2) == "Please insert skills" ? (
                        <p className="text-red-500 font-bold my-3">{err[2]}</p>
                        ) : null}
                       <input type="text" placeholder="Interests(required)" className="insertField" name="interests"></input>   
                       {err?.at(3) == "Please insert interests" ? (
                        <p className="text-red-500 font-bold my-3">{err[3]}</p>
                        ) : null}
                       <select id="cars" name="jobType" className="insertField" text="test">
                            <option value="" disabled selected>Looking for(required)</option>
                            <option value="internship">Internship</option>
                            <option value="job">Job</option>
                        </select>
                        {err?.at(7) == "Please insert jobType" ? (
                        <p className="text-red-500 font-bold my-3">{err[7]}</p>
                        ) : null}
                       <input type="text" placeholder="LinkedIn profile (optional)" className="insertField" name="linkedin"></input>
                       <br></br>
                       <input type="text" placeholder="Portofolio (optional)" className="insertField" name="portofolio"></input>
                       <br></br>
                       <input type="tel" placeholder="Phone number (required)" className="insertField" name="phoneNumber"></input>
                       {err?.at(8) == "Please insert phoneNumber" ? (
                        <p className="text-red-500 font-bold my-3">{err[8]}</p>
                        ) : null}
                       <input type="tel" placeholder="Email address (required)" className="insertField" name="email"></input>
                       {err?.at(9) == "Please insert email" ? (
                        <p className="text-red-500 font-bold my-3">{err[9]}</p>
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