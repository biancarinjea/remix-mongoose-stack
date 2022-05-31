import { redirect } from "@remix-run/node";
import { getSession } from "~/routes/session.js";
import connectDb from "~/db/connectDb.server";
export async function loader({request}) {
  const session = await getSession(request.headers.get("Cookie"));
  if(!session.get("userId"))
    return redirect("/search");
  const db = await connectDb();
  const profile = await db.models.Profile.findOne({userId:session.get("userId")});
  if(profile)
    return redirect(`/profileView/${profile._id}`);
  return redirect('/create_profile');
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

