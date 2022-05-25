import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useCatch, useLoaderData } from "@remix-run/react";
import { getSession, commitSession } from "./session.js";
import connectDb from "~/db/connectDb.server";
import bcrypt from "bcryptjs";
import img from "~/assets/register_img.png";
//import CatchBoundary from "~/components/CatchBoundary";


export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  
  if (form.get("password").trim()?.length < 8) {
    return json({ error: "Password is too short" }, { status: 400 });
  }
  const hashedPassword = await bcrypt.hash(form.get("password").trim(), 10);

  try {
    const user = await db.models.User.create({
      username: form.get("username"),
      password: hashedPassword,
      email: form.get("email")
    });

    if (user) {
      session.set("userId", user._id);
      return redirect("/login", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } else {
      return json({ error: "User couldn't be signed up" }, { status: 400 });
    }
  } catch (error) {
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

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const db = await connectDb();
  return json({
    userId: await db.models.User.findById(session.get("userId")),
  });
}

export default function Register() {
  const { userId } = useLoaderData();
  const actionData = useActionData();

  return (
    <div className="w-full p-8 rounded bg-white">
      {!userId ? (
         <><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link><div className="mb-4 pb-4 border-b flex justify-between">
         <img src={img} alt="img"></img>
         <div className="registerLayout">
           <h1 className="text-xl font-bold" id="registerTitle">Register</h1>
           <Form method="post" reloadDocument>
             <div class="input-container">
               <i class="fa fa-user icon"></i>
               <input class="input-field" type="text" placeholder="Name" name="username" />
             </div>

             <div class="input-container">
               <i class="fa fa-envelope icon"></i>
               <input class="input-field" type="text" placeholder="Email" name="email" />
             </div>

             <div class="input-container">
               <i class="fa fa-key icon"></i>
               <input class="input-field" type="password" placeholder="Password" name="password" />
             </div>
             {actionData?.error ? (
               <p className="text-red-500 font-bold my-3">{actionData.error}</p>
             ) : null}

             <button
               className="createAccount"
               type="submit"
             >
               Create Account
             </button>
           </Form>
         </div>
       </div></>
      ) : (
        <>
          <h1 className="text-xl font-bold mb-4 pb-4 border-b">
            Welcome, {userId.username}!
          </h1>

          <Form method="post" action="/logout">
            <button type="submit">Log out</button>
          </Form>
        </>
      )}
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

//export { CatchBoundary };