import { json, redirect } from "@remix-run/node";
import { Form, Outlet, useActionData,useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { getSession } from "~/routes/session.js";

export async function action({ request, params }) {
    const form = await request.formData();
    const db = await connectDb();
    const editId = params.editId;
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
    try {
      const editProfile = await db.models.Profile.findByIdAndUpdate(
        editId,
        {
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
        },
        { new: true }
      );
  return redirect(`/profileView/${editProfile._id}`);
    } catch (error) {
      return json(
        { errors: error.errors, values: Object.fromEntries(form) },
        { status: 400 }
      );
    }
  }

export async function loader({ params,request }) {
    const session = await getSession(request.headers.get("Cookie"));
    if(session.get("userId")){
        const db = await connectDb();
        const profile = await db.models.Profile.findById(params.editId);
        if (!profile) {
        throw new Response(`Couldn't find snippet with id ${params.editId}`, {
            status: 404,
        });
        }
        return json(profile);
    }
    return redirect("/register")
  }
export default function EditProfilePage(){
    const profile = useLoaderData();
    return(
        <>
             <Form method="post">
                   <div className="profile">
                       <input type="text" placeholder="Full Name(required)" className="profileInput" name="fullname" defaultValue={profile.fullname}></input>
                       <br></br>
                       <input type="number" placeholder="Age(required)" className="profileInput" name="age" min="18" max="65" style={
                           {
                               width:"39%"
                           }
                       } defaultValue={profile.age}></input>
                        <br></br>
                         <input type="text" placeholder="Location(required)" className="profileInput" name="location" defaultValue={profile.location}></input>
                       <textarea placeholder="Description(required)" className="profileInput" style={{
                           width:"100%",
                           height:"100px",
                           padding:"15px"
                       }} name="description" defaultValue={profile.description}></textarea>
                       <input type="text" placeholder="Skills(required)" className="profileInput" name="skills" defaultValue={profile.skills}></input>
                       <br></br>
                       <input type="text" placeholder="Interests(required)" className="profileInput" name="interests" defaultValue={profile.interests}></input>
                       <br></br>
                       <select id="cars" name="jobType" className="profileInput" text="test" defaultValue={profile.jobType}>
                            <option value="" disabled selected>Looking for(required)</option>
                            <option value="internship">Internship</option>
                            <option value="job">Job</option>
                        </select>
                        <br></br>
                       <input type="text" placeholder="LinkedIn profile (optional)" className="profileInput" name="linkedin" defaultValue={profile.linkedin}></input>
                       <br></br>
                       <input type="text" placeholder="Portofolio (optional)" className="profileInput" name="portofolio" defaultValue={profile.portofolio}></input>
                       <br></br>
                       <input type="tel" placeholder="Phone number (required)" className="profileInput" name="phoneNumber" defaultValue={profile.phoneNumber}></input>
                       <br></br>
                       <input type="tel" placeholder="Email address (required)" className="profileInput" name="email" defaultValue={profile.email}></input>
                       <br></br>
                       <button
                       className="createProfile"
                       type="submit">
                         Edit
                       </button>
                   </div>
               </Form>
              
        </>
    );
}