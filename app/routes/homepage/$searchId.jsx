import { useLoaderData,Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "~/routes/session.js";
import arrow from "~/assets/arrow.png";

export async function loader({ params,request }) {
    const session = await getSession(request.headers.get("Cookie"));
    const db = await connectDb();
    const p = params.searchId.split(" ");
   
    
    
    let profiles;
  
      profiles = await db.models.Profile.find({
           userId: {"$ne":session.get("userId")},
           jobType:p[0],
           skills: { $regex: new RegExp(p[1], "g") }

    }
    );
    if(p[2] === "alphabetical"){
      profiles = await db.models.Profile.find({
        userId: {"$ne":session.get("userId")},
        jobType:p[0],
        skills: { $regex: new RegExp(p[1], "g") }

 }
 ).sort({fullname:1});
    }
  if (!profiles) {
    throw new Response(`Couldn't find profile with id ${params.searchId}`, {
      status: 404,
    });
  }
  return json(profiles);
}

export default function Search(){
    const profiles = useLoaderData();
    return(
        <>
          {
            profiles.map((profile)=>{
              const desc = String(profile.description);
              return(
                  <div className="cardProfile">
                    <img  src={profile.profilePicture} className="profilePicture" alt="Avatar"></img>
                    <div className="mb-4 pb-4 border-b flex justify-between">
                      <div style={{marginTop:"1%",width:"100%"}}>
                        <b>{profile.fullname}</b>
                        <br></br>
                        <i>{profile.location}, {profile.age} years old</i>
                        <br></br>
                        <br></br>
                        <b>Skills:</b><b style={{color:"#202979"}}>{profile.skills}</b>
                        <br></br>
                        <b>Interests:</b><b style={{marginLeft:"10px",color:"#202979"}}>{profile.interests}</b>
                        <br></br>
                        <b>Looking for:</b><b style={{marginLeft:"10px",color:"#202979"}}>{profile.jobType}</b>
                        <h1 style={{fontSize:"10px",textAlign:"left",paddingTop:"20%"}}>{profile.createdAt}</h1>
                      </div>
                      <div class="vl" style={{marginLeft:"10%"}}></div>
                      <h1 style={{marginLeft:"10%",marginTop:"3%"}}>{desc.substring(0,250)}</h1>
                      <Link to={`/profile_users/${profile._id}`} className="arrow"><img src={arrow} style={{maxWidth:"50px",maxHeight:"50px"}}></img></Link>
                    </div>
                  </div>
              );
            })
          }
          <br></br>
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