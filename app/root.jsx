import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Form
} from "@remix-run/react";
import { json } from "@remix-run/node";
import styles from "~/tailwind.css";
import globalStylesUrl from "~/styles/global.css";
import logo from "~/assets/logo.png";
import { getSession, commitSession } from "~/routes/session.js";
import connectDb from "~/db/connectDb.server";
export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
  {
    rel: "stylesheet",
    href: globalStylesUrl,
  }
];

export function meta() {
  return {
    charset: "utf-8",
    title: "Remix + MongoDB",
    viewport: "width=device-width,initial-scale=1",
  };
}
export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const db = await connectDb();
  return json({
    userId: await db.models.Profile.findOne({userId:session.get("userId")}),
  });
}
export default function App() {
  const { userId } = useLoaderData();
  return (

    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100 text-slate-800 font-sans p-4">
        <div className="mb-4 pb-4 border-b flex justify-between">
            <Link to="/"><img src={logo} alt="logo"></img></Link>
            {!userId ? (
               <div>
               <Link to="/register" className="register">
               Register
             </Link>
             <Link to="/login" className="login">
               Sign In
             </Link>
               </div>
            ):(
               <div>
                 <Link to={`profileView/${userId._id}`}>My Profile</Link>
                 <Form method="post" action="/logout">
                  <button type="submit">Log out</button>
                </Form>
               </div>
            )
            }
           
          </div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
