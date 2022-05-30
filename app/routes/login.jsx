import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { getSession, commitSession } from "./session.js";
import connectDb from "~/db/connectDb.server";
import bcrypt from "bcryptjs";
import img from "~/assets/register_img.png";

export async function action({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));

  const form = await request.formData();
  const username = form.get("username").trim();
  const password = form.get("password"); 
  const user = await db.models.User.findOne({
    username,
  });
  // comparing the password input to hashed password in the database
  try{
  if (await bcrypt.compare(password, user.password)) {
    session.set("userId", user._id);
    const profile = await db.models.Profile.findOne({
      userId: session.get("userId")
    })
    if(!profile){
      return redirect("/create_profile", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }else{
      return redirect(`/profileView/${profile._id}`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  } else {
    return json(
      { error: "User not found or password didn't match" },
      { status: 401 }
    );
  }
  }catch(e){
    return json(
      { error: "User not found or password didn't match" },
      { status: 401 }
    );
  }
}
  export async function loader({ request }) {
    const session = await getSession(request.headers.get("Cookie"));
    const db = await connectDb();
    return json({
      userId: await db.models.User.findById(session.get("userId")),
    });
  }
  export default function Login() {
    const { user } = useLoaderData();
    const actionData = useActionData();
    return(
        <div>
            {!user?(
               <><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link><div className="mb-4 pb-4 border-b flex justify-between">
            <img src={img} alt="img"></img>
            <div className="registerLayout">
              <h1 className="text-xl font-bold" id="registerTitle">Sign In</h1>
              <Form method="post" reloadDocument>
                <div class="input-container">
                  <i class="fa fa-user icon" style={{backgroundColor:"#9F97D6"}}></i>
                  <input class="input-field" type="text" placeholder="Name" name="username" />
                </div>

                <div class="input-container">
                  <i class="fa fa-envelope icon" style={{backgroundColor:"#9F97D6"}}></i>
                  <input class="input-field" type="text" placeholder="Email" name="email" />
                </div>

                <div class="input-container">
                  <i class="fa fa-key icon" style={{backgroundColor:"#9F97D6"}}></i>
                  <input class="input-field" type="password" placeholder="Password" name="password" />
                </div>
                {actionData?.error ? (
                  <p className="text-red-500 font-bold my-3">{actionData.error}</p>
                ) : null}

                <button
                  className="registerBtn"
                  type="submit"
                >
                  Sign In
                </button>
              </Form>
            </div>
          </div></>
            ): <>
                 <h1 className="text-xl font-bold mb-4 pb-4 border-b">
                  Welcome, {user.username}!
                </h1>

                <Form method="post" action="/logout">
                  <button type="submit">Log out</button>
                </Form>
              </>
            }
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