import { useLoaderData, useCatch } from "@remix-run/react";
import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession, commitSession } from "~/routes/session.js";

export async function loader({ params,request }) {
    const session = await getSession(request.headers.get("Cookie"));
    const db = await connectDb();
    const p = params.searchId.split(" ");
    const p1 = p[1].split(",");
    const profiles = await db.models.Profile.find({
           userId: {"$ne":session.get("userId")},
           jobType:p[0],
           skills: { $regex: new RegExp(p[1], "g") }
    }
    )
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
              return(
                <div className="cardProfile">
                  <div className="mb-4 pb-4 border-b flex justify-between">
                  <img  src={profile.profilePicture} className="profilePicture" style={{marginTop:"3%",marginLeft:"1%"}} alt="Avatar"></img>
                    <div style={{marginLeft:"2%",marginTop:"1%"}}>
                      <b>{profile.fullname}</b>
                      <br></br>
                      <i>{profile.location}, {profile.age} years old</i>
                      <br></br>
                      <br></br>
                      <b>Skills:  {profile.skills}</b>
                      <br></br>
                      <b>Interests:  {profile.interests}</b>
                      <br></br>
                      <b>Looking for:  {profile.jobType}</b>
                    </div>
                    <div class="vl"></div>
                    <h1 style={{marginRight:"20%",marginTop:"3%"}}>{profile.description}</h1>
                  </div>
                </div>
              );
            })
          }
          <br></br>
        </>
    );
}