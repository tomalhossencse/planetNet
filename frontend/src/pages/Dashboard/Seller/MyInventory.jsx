import { useMutation, useQuery } from "@tanstack/react-query";
import PlantDataRow from "../../../components/Dashboard/TableRows/PlantDataRow";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyInventory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: plants = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["plants", user?.email],
    enabled: !!user,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-inventory/${user?.email}`);
      return res.data;
    },
  });

  const {
    // isPending,
    // isError,
    mutateAsync,
    reset: mutationReset,
  } = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/my-inventory/${id}`),
    onSuccess: (data) => {
      console.log(data.data);

      // show toast
      toast.success("Plant Deleted Successfully");
      refetch();
      mutationReset();
      // query key invalided
    },
    onError: (error) => {
      console.log(error);
    },
    onMutate: (payload) => {
      console.log("I will delete the data------->", payload);
    },
    onSettled: (data, error) => {
      if (data) console.log(data);
      if (error) console.log(error);
    },
    retry: 3,
  });
  const handleDeletePlant = async (id) => {
    try {
      await mutateAsync(id);
      // const result = await axios.delete(
      //   `${import.meta.env.VITE_API_URL}/my-inventory/${id}`,
      // );
      // if (result.data.deletedCount) {
      //   refetch();
      //   toast.success("Plant Delete Successful");
      // }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  return (
    <>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="mb-6">Total Plants : {plants.length}</div>
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Quantity
                    </th>

                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Delete
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Update
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {plants.map((plant) => (
                    <PlantDataRow
                      key={plant._id}
                      plant={plant}
                      handleDeletePlant={handleDeletePlant}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyInventory;
