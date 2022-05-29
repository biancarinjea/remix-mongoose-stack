import { useLoaderData, Link,LiveReload,Form, useParams,
    useSearchParams,Outlet } from "@remix-run/react";
  import connectDb from "~/db/connectDb.server.js";
  import img from "~/assets/img.png";
  import { json, redirect } from "@remix-run/node";
  import { getSession } from "~/routes/session.js";
  
  export async function action({request}){
    const form = await request.formData();
    const jobType = form.get("jobType");
    const skills = form.get("skills");
     return redirect(`search/${jobType}%20${skills}`);
  }
  
  export default function Search() {
    const profiles = useLoaderData();
    return (
      <div style={{
        background:"white"
      }}>
         <div className="mb-4 pb-4 border-b flex justify-between" style={
                     {
                         background:"white",
                         width:"70%",
                     }
                 }>
                     <img src={img} alt="img" className="img"></img>
                     <div>
                          <div className="profile" style={{
                            background:"#9F97D6",
                            width:"70%",
                            marginTop:"20%"
                            }}>
                              <i >The journey starts now with Junior Venture!</i>
                          </div>
                     </div>
          </div>
            <Form method="post">
            <b>Search By</b>
            <select id="job" name="jobType" className="profileInput" text="test">
                <option value="" disabled selected>Looking for(required)</option>
                <option value="internship">Internship</option>
                <option value="job">Job</option>
            </select>
            <select id="career" name="careerField" className="profileInput" text="test">
                <option value="" disabled selected>Career Field</option>
                <option value="career">Web Developer</option>
            </select>
            <input type="text" placeholder="Skills" className="profileInput" name="skills"></input>
            <button
              className="createAccount"
              type="submit"
              style={{
                marginTop:"5%"
              }}
              >
                Search
             </button>
            </Form>
          <LiveReload />
          <Outlet/>
      </div>
    );
  }
  
  