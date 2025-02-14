"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import useAppContext from "@/context/AppContext";
import { BiSolidCommentDetail } from "react-icons/bi";
import { FaChevronDown } from "react-icons/fa";

const Enquiry = () => {
  const { currentUser } = useAppContext();

  const [enquiry, setEnquiry] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
  const [selectedEnquiryName, setSelectedEnquiryName] = useState("");
  const [remark, setRemark] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/enquiry/getall`
      );
      setEnquiry(response.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (enquiry.length > 0) {
      $("#example1").DataTable({
        responsive: true,
        destroy: true, // Prevent reinitialization issues
        dom: "Bfrtip", // Add buttons layout
        buttons: ["copy", "csv", "excel", "pdf", "print"], // Export options
        pageLength: 10,
        language: {
          searchPlaceholder: "...",
          paginate: {
            previous: "<", // Replaces "Previous" with "<"
            next: ">", // Replaces "Next" with ">"
          },
        },
        pagingType: "simple_numbers", // Options: 'simple', 'simple_numbers', 'full', 'full_numbers'
      });
    }
  }, [enquiry]);

  const handleOpenModal = (id, name) => {
    setSelectedEnquiryId(id);
    setSelectedEnquiryName(name);
    setRemark("");
    document.getElementById("my_modal_3").showModal();
  };

  const handleSubmitRemark = async (e) => {
    e.preventDefault();
    if (!remark.trim()) {
      toast.error("Remark cannot be empty!");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/enquiry/addRemark`,
        {
          enquiryId: selectedEnquiryId,
          remark: remark,
          enquiryRemarkAddedBy: currentUser.userId, // Sending only userId
          enquiryRemarkDate: Math.floor(Date.now() / 1000), // Unix timestamp
        }
      );

      toast.success("Remark added successfully!");
      document.getElementById("my_modal_3").close();
      //   setTimeout(() => {
      //     window.location.reload();
      //   }, 2000);
      fetchData();
    } catch (error) {
      toast.error("Failed to add remark.");
      console.error(error);
    }
  };

  const [remarkEnq, setRemarkEnq] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  const fetchSecondData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/remark-enquiry/getall`
      );
      setRemarkEnq(response.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchSecondData();
  }, []);

  useEffect(() => {
    fetchSecondData();
  }, []);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable("#example2")) {
      $("#example2").DataTable().destroy(); // Destroy existing DataTable
    }
  
    if (remarkEnq.length > 0) {
      $("#example2").DataTable({
        responsive: true,
        destroy: true,
        dom: "Bfrtip",
        buttons: ["copy", "csv", "excel", "pdf", "print"],
        pageLength: 10,
        language: {
          searchPlaceholder: "...",
          paginate: {
            previous: "<",
            next: ">",
          },
        },
        pagingType: "simple_numbers",
      });
    }
  }, [remarkEnq]); // Re-run when remarkEnq updates
  

  const toggleExpand = (name) => {
    setExpandedRows((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  
  return (
    <>
      <div>
        <nav className="flex gap-x-1">
          <button
            className={`py-2 px-1 border-b-2 text-sm ${
              activeTab === 0
                ? "font-semibold border-emerald-500 text-emerald-500"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab(0)}
          >
            Enquiry List
          </button>
          <button
            className={`py-2 px-1 ml-5 border-b-2 text-sm ${
              activeTab === 1
                ? "font-semibold border-emerald-500 text-emerald-500"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab(1)}
          >
            Enquiry Remarks
          </button>
        </nav>
      </div>

      <div className="mt-3">
        <div className={`${activeTab === 0 ? "" : "hidden"}`}>
          <div className="bg-white border shadow-md rounded p-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
              Manage Enquiry's
            </h3>

            <table id="example1" className="display  nowwrap w-100 table-auto">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Name</th>
                  <th>Number</th>
                  <th>Message</th>
                  <th>Remark</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {enquiry.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-3 font-semibold">
                      No available data
                    </td>
                  </tr>
                ) : (
                  enquiry.map((item, index) => (
                    <tr key={item.enquiryId}>
                      <td>{index + 1}</td>
                      <td>{item.enquiryName}</td>
                      <td>{item.enquiryNumber}</td>
                      <td>{item.enquiryMsg}</td>
                      <td>{item.newEnquiry}</td>
                      <td>
                        {item.postedAt
                          ? format(
                              new Date(item.postedAt * 1000),
                              "dd MMM yyyy hh:mm (EEE)"
                            )
                          : "N/A"}
                      </td>
                      <td>
                        <div className="flex justify-center w-full">
                          <button
                            className=" py-1.5 px-1.5 bg-emerald-500 text-white rounded transition duration-300 hover:scale-110"
                            onClick={() =>
                              handleOpenModal(item.enquiryId, item.enquiryName)
                            }
                          >
                            <BiSolidCommentDetail className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for adding remark */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box rounded">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-5 top-5 focus:outline-none"
            onClick={() => document.getElementById("my_modal_3").close()}
          >
            ✕
          </button>
          <h2 className="font-bold text-xl border-b-2 pb-4">
            Add Remark for{" "}
            <span className=" text-emerald-500">{selectedEnquiryName}</span>
          </h2>
          <form onSubmit={handleSubmitRemark}>
            <div className="flex flex-col mb-4 pt-4">
              <label htmlFor="enquiryRemarkText" className="pb-1 font-semibold">
                Remark
              </label>
              <textarea
                rows={3}
                id="enquiryRemarkText"
                className="p-2 focus:ring-2 focus:ring-emerald-300 rounded focus:outline-none border-2"
                placeholder="Enter Remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-500 text-white font-bold py-2 rounded hover:shadow-lg hover:bg-emerald-600"
            >
              Submit Remark
            </button>
          </form>
        </div>
      </dialog>

      <div className="mt-3">
        <div className={`${activeTab === 1 ? "" : "hidden"}`}>
          <div className="bg-white border shadow-md rounded p-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
              Manage Remark's
            </h3>

            <table
              id="example2"
              className="display nowwrap w-100 table-auto border"
            >
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Name</th>
                  <th>Remark</th>
                  <th>Added By</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {remarkEnq.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-3 font-semibold">
                      No available data
                    </td>
                  </tr>
                ) : (
                  remarkEnq
                    .filter(
                      (item, index, self) =>
                        self.findIndex(
                          (i) => i.enquiryName === item.enquiryName
                        ) === index
                    ) // Show unique names initially
                    .map((item, index) => (
                      <React.Fragment key={item.enquiryRemarkId}>
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item.enquiryName}</td>
                          <td>{item.enquiryRemarkText}</td>
                          <td>{item.enquiryRemarkAddedBy}</td>
                          <td>
                            {item.enquiryRemarkDate
                              ? format(
                                  new Date(item.enquiryRemarkDate * 1000),
                                  "dd MMM yyyy hh:mm (EEE)"
                                )
                              : "N/A"}
                          </td>
                          <td>
                            <div className="flex justify-center ">
                              <button
                                className="py-1 px-1 bg-emerald-300 text-spaceblack rounded transition duration-300 hover:scale-110"
                                onClick={() => toggleExpand(item.enquiryName)}
                              >
                                <FaChevronDown className="text-lg" />
                              </button>
                              
                            </div>
                          </td>
                        </tr>

                        {expandedRows[item.enquiryName] &&
                          remarkEnq
                            .filter(
                              (row) =>
                                row.enquiryName === item.enquiryName &&
                                row.enquiryRemarkId !== item.enquiryRemarkId
                            )
                            .map((subItem) => (
                              <tr
                                key={subItem.enquiryRemarkId}
                                className="bg-gray-100"
                              >
                                <td></td>
                                <td></td>
                                <td>{subItem.enquiryRemarkText}</td>
                                <td>{subItem.enquiryRemarkAddedBy}</td>
                                <td>
                                  {subItem.enquiryRemarkDate
                                    ? format(
                                        new Date(
                                          subItem.enquiryRemarkDate * 1000
                                        ),
                                        "dd MMM yyyy hh:mm (EEE)"
                                      )
                                    : "N/A"}
                                </td>
                                <td></td>
                              </tr>
                            ))}
                      </React.Fragment>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Enquiry;
