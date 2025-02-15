import { useLoaderData, useCatch,Form} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "~/routes/session.js";
import leftArrow from "~/assets/leftArrow.png";


export async function action({request, params}){
  const form = await request.formData();
  const profile = params.profileId;
  const db = await connectDb();
  if(form.get("_method") === "delete"){
    try {
      await db.models.Profile.findByIdAndDelete({
        _id: profile,
      });
      return redirect("/create_profile");
    } catch (error) {
      return json(
        { errors: error.errors, values: Object.fromEntries(form) },
        { status: 400 }
      );
    }
  }else if(form.get("_method") === "edit"){
    return redirect(`/edit/${profile}`);
  }
}
export async function loader({ params,request}) {
    const session = await getSession(request.headers.get("Cookie"));
      const db = await connectDb();
      const profile = await db.models.Profile.findById(params.profileId);
      if (!profile) {
        throw new Response(`Couldn't find book with id ${params.profileId}`, {
          status: 404,
        });
      }
      if(profile.userId == session.get("userId"))
         return json(profile);
      return redirect("/register");
  }

  export default function ProfilePage() {
    const profile = useLoaderData();
    let skills;
    let interests;
    let job=String(profile.jobType);
    let jobType = job.charAt(0).toUpperCase() + job.slice(1);
    if(profile){
      skills = profile.skills.split(",");
      interests = profile.interests.split(",");
    }
    return (
        <>
           <div  style={{marginLeft:"30%"}}><b style={{fontSize:"20px"}}>My Profile</b></div>
          <div className="profileLayout">
              <img  src={profile.profilePicture} className="profilePicture"></img>
              <h1 className="text-2xl font-bold ">{profile.fullname}</h1>
          <i>{profile.location}, {profile.age} years old</i>
          <br></br>
          <br></br>
          <b>Looking for: <i style={{color:"#a31aff"}}>{jobType}</i></b>
          <br></br>
          <i>{profile.description}</i>
          <div className="mb-4 pb-4 border-b flex justify-between" style={{marginTop:"20%"}}>
            <div >
              <b>Skills</b>
              <div className="border"></div>
              {
                skills.map((skill)=>{
                  return (
                    <div>
                         <i>{skill}</i>
                        <br></br>
                    </div>
                  );
                })
              }
            </div>
            <div >
              <b>Portofolio</b>
              <div className="border"></div>
              <br></br>
              <i>{profile.portofolio}</i>
            </div>
          </div>
          <div className="mb-4 pb-4 border-b flex justify-between" style={{marginTop:"20%"}}>
            <div >
              <b>Interests</b>
              <div className="border"></div>
              {
                interests.map((interest)=>{
                  return(
                    <div>
                      <i>{interest}</i>
                      <br></br>
                    </div>
                  );
                })
              }
            </div>
            <div >
              <b>Contact</b>
              <div className="border"></div>
              <i>{profile.email}</i>
              <br></br>
              <i>{profile.phoneNumber}</i>
            </div>
          </div>
          <div className="mb-4 pb-4 border-b flex justify-between">
            <button onClick={()=>{history.back()}}><img src={leftArrow}></img></button>
            <i>Created at {profile.createdAt}</i>
          </div>
             <div className="btn-group">
             <Form method="post">
             <button
                     className="createAccount"
                      type="submit"
                      name="_method"
                      value="delete"
                    >
                 DELETE
                </button>
             </Form>
             <Form method="post" >
             <button
                      className="createAccount"
                      type="submit"
                      name="_method"
                      value="edit"
                    >
                 EDIT
                </button>
             </Form>
             </div>
          </div>
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