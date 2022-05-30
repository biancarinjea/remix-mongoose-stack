import connectDb from "~/db/connectDb.server";
import profiles from "~/db/profiles.json";
import users from "~/db/users.json";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";


export async function loader() {
  const db = await connectDb();
  const currentProfiles = await db.models.Profile.find().countDocuments();
  const seededProfiles = profiles;
  const currentUsers = await db.models.User.find().countDocuments();
  const seededUsers = users;
  return {
    currentProfiles,
    seededProfiles,
    currentUsers,
    seededUsers,
  };
}

export async function action() {
  const db = await connectDb();
  try {
   // await db.models.Profile.deleteMany();
    await db.model.Profile.insertMany(profiles);
   // await db.models.Users.deleteMany();
    await db.models.Users.insertMany(users);
   
  } catch (error) {
    
  }
  return redirect("/");
}

export default function Seed() {
  const { currentProfiles, seededProfiles,currentUsers,seededUsers } = useLoaderData();
  return (
    <div className="w-8/12 p-8 rounded bg-white">
      <h1 className="text-xl font-bold mb-4 pb-4 border-b">
        Seeding the database
      </h1>
      <p className="text-sm">
        You currently have {currentProfiles} profiles in your database.
        <br></br>
        You currently have {currentUsers} users in your database.
        <br></br>
        Do you want to delete your profiles and  re-seed with {seededProfiles.length} default profiles?
        <br></br>
        Do you want to delete your users and  re-seed with {seededUsers.length} default users?
          </p>
          
      <div className="flex mt-8 gap-2">
        <Form method="post">
          <button
            type="submit"
            className="bg-red-500 text-white p-2 w-20 rounded text-sm"
          >
            Yes
          </button>
        </Form>
        <Link to="/">
          <button className="bg-blue-500 text-white p-2 w-20 rounded text-sm">
            No
          </button>
        </Link>
      </div>
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
