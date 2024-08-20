import VehicleForm from "../(components)/VehicleForm";

export const metadata = {
  title: "Create Vehicle",
  description: "Dstilez Auto Admin - Create a Vehicle",
  // Inherits openGraph.title and openGraph.description
};

// Allow user's to request property features for us to add
export default async function CreateVehicle() {
  return (
    <section id="CreateVehicle" className="w-full flex justify-start items-center min-h-screen  ">
      <VehicleForm />
    </section>
  );
}
