import { json, redirect } from "@remix-run/node";
import { Form, Outlet, useActionData,useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { getSession } from "~/routes/session.js";

export async function action({ request, params }) {
    const form = await request.formData();
    let {_action, ... values} = Object.fromEntries(form)
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
    const profilePicture = form.get("profilePicture")
    if(_action === "Save"){
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
              profilePicture:profilePicture
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
  }
export async function loader({ params,request }) {
    const session = await getSession(request.headers.get("Cookie"));
    const db = await connectDb();
    const profile = await db.models.Profile.findById(params.editId);
    if(session.get("userId")==profile.userId){
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
             <div className="insertProfile">
                       <input type="text" placeholder="Profile picture(required)" className="insertField" name="profilePicture" defaultValue={profile.profilePicture}></input>
                       <br></br>
                       <input type="text" placeholder="Full Name(required)" className="insertField" name="fullname" defaultValue={profile.fullname}></input>
                       <br></br>
                       <input type="number" placeholder="Age(required)" defaultValue={profile.age} className="insertField" name="age" min="18" max="65" style={
                           {
                               width:"39%"
                           }
                       }></input>
                        <br></br>
                         <input type="text" placeholder="Location(required)" className="insertField" defaultValue={profile.location} name="location"></input>
                       <textarea placeholder="Description(required)" className="insertField" defaultValue={profile.description} style={{
                           width:"100%",
                           height:"100px",
                           padding:"15px"
                       }} name="description"></textarea>
                       <input type="text" placeholder="Skills(required)" defaultValue={profile.skills} className="insertField" name="skills"></input>
                       <br></br>
                       <input type="text" placeholder="Interests(required)" className="insertField" defaultValue={profile.interests} name="interests"></input>
                       <br></br>
                       <select id="cars" name="jobType" className="insertField" defaultValue={profile.jobType} text="test">
                            <option value="" disabled selected>Looking for(required)</option>
                            <option value="internship">Internship</option>
                            <option value="job">Job</option>
                        </select>
                        <br></br>
                       <input type="text" placeholder="LinkedIn profile (optional)" defaultValue={profile.linkedin} className="insertField" name="linkedin"></input>
                       <br></br>
                       <input type="text" placeholder="Portofolio (optional)" defaultValue={profile.portofolio} className="insertField" name="portofolio"></input>
                       <br></br>
                       <input type="tel" placeholder="Phone number (required)" defaultValue={profile.phoneNumber} className="insertField" name="phoneNumber"></input>
                       <br></br>
                       <input type="tel" placeholder="Email address (required)" defaultValue={profile.email} className="insertField" name="email"></input>
                       <br></br>
                       <div className="btn-group" style={{marginTop:"2%"}}>
                          <button className="createProfile" type="submit" name = "_action" value="Save">Save</button>
                         <button className="createProfile" type="submit" name = "_action" value="Discard"><a href={"/profileView/"+profile._id}>Discard</a></button>
                       </div>
                   </div>
               </Form>
        </>
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