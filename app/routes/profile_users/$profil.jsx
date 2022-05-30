import { useLoaderData} from "@remix-run/react";
import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import leftArrow from "~/assets/leftArrow.png";

export async function loader({ params,request}) {
      const db = await connectDb();
      const profile = await db.models.Profile.findById(params.profil);
      if (!profile) {
        throw new Response(`Couldn't find book with id ${params.profil}`, {
          status: 404,
        });
      }
      return json(profile);
  }

  export default function ProfilePage() {
    const profile = useLoaderData();
    let skills;
    let interests;
    if(profile){
      skills = profile.skills.split(",");
      interests = profile.interests.split(",");
    }
    return (
        <>
         <div className="profileLayout">
              <img  src={profile.profilePicture} className="profilePicture"></img>
              <h1 className="text-2xl font-bold mb-4">{profile.fullname}</h1>
          <i>{profile.location}, {profile.age} years old</i>
          <br></br>
          <b>Looking for: <i style={{color:"#a31aff"}}>{profile.jobType}</i></b>
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