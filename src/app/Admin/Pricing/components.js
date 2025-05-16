"use client";

import { AddPowerBank , EditPowerBank , GetLateReturn, GetPowerBank , AddLateReturn  , AddReserveTime , GetReserveTime , EditReserveTime, EditLateReturn } from "../../Adminapicalls";
import "../../css/Pricing.css"
import { useEffect, useState, useRef } from "react";



const PowerBanks = ({ IsEditPowerBankActive, IsAddPowerBankActive, FormData }) => {
  const  [apiResponse ,setApiResponse] = useState([])
  const [loading, setLoading] = useState(true);


    const handleClick = (powerBank,element) => {
      element((prev) => !prev);
      if (powerBank) {   
          FormData(powerBank);
      }
    };
  
    
  
    
    useEffect(() => {
      const loadUser = async () => {
        const result = await GetPowerBank()
        setApiResponse(result || []);
        console.log(result);
        setLoading(false) 
      };
       
      loadUser();
    }, []);
  
  

  
  
    return (
      <section className="boxed_container">
        <h1>
          power banks
          <img src="/assets/images/add-b.svg" alt="add" onClick={() => handleClick(false,IsAddPowerBankActive)}/>
        </h1>
        {loading && <p>Loading...</p>}
        {apiResponse.length < 1 && !loading? (
      <h2 className="info">
        Please, there is no powerBank. click the add button to add power bank.
      </h2>
       ) : (
      <section className="more">
        {apiResponse.map((powerBank) => (
          <div
            key={powerBank._id}
            onClick={() => handleClick(powerBank, IsEditPowerBankActive)}
          >
            <h2>{powerBank.Name}</h2>
            <p>
              {powerBank.Price} <strong>&#8358;</strong>
            </p>
          </div>
        ))}
      </section>
       )}
      </section>
    );
  };

  const PopupEditPowerBank = ({ PopupEditPowerBankActive, PopupEditPowerBankSetActive, FormData }) => {
    const [formData, setFormData] = useState({
      id: "",
      Name: "",
      Price: "",
    });
  
    const [responseGotten, setResponseGotten] = useState(true);
  
    // Set initial form data only when FormData updates
    useEffect(() => {
      if (FormData && FormData._id) {
        setFormData({
          id: FormData._id,
          Name: FormData.Name || "",
          Price: FormData.Price || "",
        });
      }
    }, [FormData]);
  
    const handleClick = (element) => {
      element((prev) => !prev);
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async () => {
      const { Name, Price } = formData;
  
      if (!Name || !Price) {
        alert("Please fill in all fields");
        return;
      }
  
      const newFormData = {
        ItemId: formData.id,
        Name: formData.Name,
        Price: formData.Price,
      };
  
      setResponseGotten(false); // disable button while waiting
      await EditPowerBank(newFormData);
      setResponseGotten(true);  // re-enable after done
  
      handleClick(PopupEditPowerBankActive);
  
      setFormData({
        id: "",
        Name: "",
        Price: "",
      });
  
      console.log("Submitted Data:", newFormData);
    };
  
    return (
      <section className={PopupEditPowerBankSetActive ? "popup active" : "popup"}>
        <section className="content">
          <h1>
            Edit PowerBank
            <img
              src="../assets/images/close-square.svg"
              alt="close"
              onClick={() => handleClick(PopupEditPowerBankActive)}
            />
          </h1>
          <br />
          <label>
            Type
            <input
              type="text"
              name="Name"
              value={formData.Name}
              placeholder="e.g. 10,000MAH"
              onChange={handleChange}
            />
          </label>
          <label>
            Price
            <input
              type="number"
              name="Price"
              value={formData.Price}
              onChange={handleChange}
            />
          </label>
          <br />
          <button
            className={responseGotten ? "" : "notActive"}
            onClick={handleSubmit}
          >
            Send
          </button>
        </section>
      </section>
    );
  };

    const PopupAddPowerBank = ({ PopupAddPowerBankActive, PopupAddPowerBankSetActive }) => {
      const [formData, setFormData] = useState({
        Name: "",
        Price: "",
      });
      const [responseGotten , setResponseGotten] =useState(true)

      const handleClick = (element) => {
        element((prev) => !prev);
      };
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
    
      const handleSubmit = async () => {
        const { Name, Price } = formData;
    
        if (!Name || !Price) {
          alert("Please fill in all fields");
          return;
        }
        const newFormData ={
          Name:formData.Name,
          Price:formData.Price
        }
        setResponseGotten(false);
         await AddPowerBank(newFormData)
         setResponseGotten(true);
         handleClick(PopupAddPowerBankActive)
         setFormData({
          Name:"",
          Price:""
         })
        console.log("Submitted Data:", formData);
      };
    
      return (
        <section className={PopupAddPowerBankSetActive ? "popup active" : "popup"}>
          <section className="content">
            <h1>
              Edit PowerBank
              <img
                src="../assets/images/close-square.svg"
                alt="close"
                onClick={() => handleClick(PopupAddPowerBankActive)}
              />
            </h1>
            <br />
            <label>
              Type
              <input
                type="text"
                name="Name"
                value={formData.Name}
                placeholder="000,000MAH"
                onChange={handleChange}
              />
            </label>
            <label>
              Price
              <input
                type="number"
                name="Price"
                value={formData.Price}
                onChange={handleChange}
              />
            </label>
            <br />
            <button className={responseGotten?"":"notActive"}  onClick={handleSubmit}>Send</button>
          </section>
        </section>
      );
    };
    




    const PopupEditLateReturnPrice = ({ PopupEditLateReturnPriceActive, PopupEditLateReturnPriceSetActive, FormData }) => {
      const [formData, setFormData] = useState({
        id: "",
        Name: "",
        Price: "",
      });
    
      const [responseGotten, setResponseGotten] = useState(true);
    
      useEffect(() => {
        if (FormData && FormData._id) {
          setFormData({
            id: FormData._id,
            Name: FormData.Name || "",
            Price: FormData.Price || "",
          });
        }
      }, [FormData]);
    
      const handleClick = (element) => {
        element((prev) => !prev);
      };
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
    
      const handleSubmit = async () => {
        const { Price, Name } = formData;
    
        if (!Price || !Name) {
          alert("Please fill in all fields");
          return;
        }
    
        const newFormData = {
          ItemId: formData.id,
          Name: formData.Name,
          Price: formData.Price,
        };
    
        setResponseGotten(false);
        await EditLateReturn(newFormData);
        setResponseGotten(true);
    
        handleClick(PopupEditLateReturnPriceActive);
    
        setFormData({
          id: "",
          Name: "",
          Price: "",
        });
    
        console.log("Submitted Data:", newFormData);
      };
    
      return (
        <section className={PopupEditLateReturnPriceSetActive ? "popup active" : "popup"}>
          <section className="content">
            <h1>
              Edit Late Return Price
              <img
                src="../assets/images/close-square.svg"
                alt="close"
                onClick={() => handleClick(PopupEditLateReturnPriceActive)}
              />
            </h1>
            <br />
            <label>
              PowerBank Name
              <input
                type="text"
                name="Name"
                value={formData.Name}
                readOnly
              />
            </label>
            <label>
              Price
              <input
                type="number"
                name="Price"
                value={formData.Price}
                onChange={handleChange}
              />
            </label>
            <br />
            <button
              className={responseGotten ? "" : "notActive"}
              onClick={handleSubmit}
            >
              Send
            </button>
          </section>
        </section>
      );
    };
    


  
  const PopupAddLateReturnPrice = ({ PopupAddLateReturnPriceActive, PopupAddLateReturnPriceSetActive }) => {
    const [apiResponse, setApiResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responseGotten, setResponseGotten] = useState(true);
  
    const [formData, setFormData] = useState({
      Name: "",
      Price: "",
    });
  
    const handleClick = (element) => {
      element((prev) => !prev);
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async () => {
      const { Name, Price } = formData;
  
      if (!Name || !Price) {
        alert("Please fill in all fields");
        return;
      }
  
      const newFormData = {
        Name:Name,
        Price:Price,
      };
  
      setResponseGotten(false);
      await AddLateReturn(newFormData);
      setResponseGotten(true);
  
      handleClick(PopupAddLateReturnPriceActive);
  
      setFormData({
        Name: "",
        Price: "",
      });
  
      console.log("Submitted Late Return Data:", newFormData);
    };
  
    useEffect(() => {
      const loadPowerBanks = async () => {
        const result = await GetPowerBank();
        setApiResponse(result);
        setLoading(false);
      };
  
      loadPowerBanks();
    }, []);
  
    return (
      <section className={PopupAddLateReturnPriceSetActive ? "popup active" : "popup"}>
        <section className="content">
          <h1>
            Add Late Return Price (HRE)
            <img
              src="../assets/images/close-square.svg"
              alt="close"
              onClick={() => handleClick(PopupAddLateReturnPriceActive)}
            />
          </h1>
  
          {loading && <p>Loading...</p>}
  
          <label>
            Select PowerBank
            <select
              name="Name"
              value={formData.Name}
              onChange={handleChange}
            >
              <option value="">Choose PowerBank</option>
              {apiResponse.map((powerBank) => (
                <option value={powerBank.Name} key={powerBank._id}>
                  {powerBank.Name}
                </option>
              ))}
            </select>
          </label>
  
          <label>
            Price
            <input
              type="number"
              name="Price"
              value={formData.Price}
              onChange={handleChange}
            />
          </label>
  
          <br />
          <button
            className={responseGotten ? "" : "notActive"}
            onClick={handleSubmit}
          >
            Send
          </button>
        </section>
      </section>
    );
  };


  const LateReturnPrice = ({ IsEditLateReturnPriceActive, IsAddLateReturnPriceActive, FormData }) => {
  
      const  [apiResponse ,setApiResponse] = useState([])
      const [loading, setLoading] = useState(true);
        
    
        const handleClick = (lateReturnPrice,element) => {
          element((prev) => !prev);
          if (lateReturnPrice) {   
              FormData(lateReturnPrice);
          }
        };
      
        
      
        
        useEffect(() => {
          const loadUser = async () => {
            const result = await GetLateReturn()
            setApiResponse(result || []);
            console.log(result);
            setLoading(false) 
          };
           
          loadUser();
        }, []);
      
      
    
  
    return (
      <section className="boxed_container">
      <h1>
        Late return price (h)
        <img src="/assets/images/add-b.svg" alt="add" onClick={() => handleClick(false, IsAddLateReturnPriceActive)}/>
      </h1>
      {loading && <p>Loading...</p>}
      {apiResponse.length < 1 && !loading? (
    <h2 className="info">
      Please, there is no late return price. click the add button to add power bank.
    </h2>
     ) : (
    <section className="more">
      {apiResponse.map((lateReturnPrice) => (
        <div
          key={lateReturnPrice._id}
          onClick={() => handleClick(lateReturnPrice,IsEditLateReturnPriceActive)}
        >
          <h2>{lateReturnPrice.Name}</h2>
          <p>
            {lateReturnPrice.Price} <strong>&#8358;</strong>
          </p>
        </div>
      ))}
    </section>
     )}
    </section>
    );
  };
  

  



  const PopupEditReserveTime = ({ PopupEditReserveTimeActive, PopupEditReserveTimeSetActive, FormData }) => {
    const [formData, setFormData] = useState({
      id: "",
      Name: "",
      Price: "",
    });
  
    const [responseGotten, setResponseGotten] = useState(true);
  
    useEffect(() => {
      if (FormData && FormData._id) {
        setFormData({
          id: FormData._id,
          Name: FormData.Name || "",
          Price: FormData.Price || "",
        });
      }
    }, [FormData]);
  
    const handleClick = (element) => {
      element((prev) => !prev);
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async () => {
      const { Name, Price } = formData;
  
      if (!Name || !Price) {
        alert("Please fill in all fields");
        return;
      }
  
      const newFormData = {
        ItemId: formData.id,
        Name,
        Price,
      };
  
      setResponseGotten(false);
      await EditReserveTime(newFormData);
      setResponseGotten(true);
  
      handleClick(PopupEditReserveTimeActive);
      setFormData({ id: "", Name: "", Price: "" });
  
      console.log("Submitted Edit Reserve Time:", newFormData);
    };
  

    return (
      <section className={PopupEditReserveTimeSetActive ? "popup active" : "popup"}>
        <section className="content">
          <h1>
            Edit Reserve Time
            <img
              src="../assets/images/close-square.svg"
              alt="close"
              onClick={() => handleClick(PopupEditReserveTimeActive)}
            />
          </h1>
          <br />
          <label>
            Name
            <input type="text" name="Name" value={formData.Name} readOnly />
          </label>
          <label>
            Price
            <input type="number" name="Price" value={formData.Price} onChange={handleChange} />
          </label>
          <br />
          <button className={responseGotten ? "" : "notActive"} onClick={handleSubmit}>Send</button>
        </section>
      </section>
    );
  };
  
  const PopupAddReserveTime = ({ PopupAddReserveTimeActive, PopupAddReserveTimeSetActive }) => {
    const [formData, setFormData] = useState({
      Name: "",
      Price: "",
    });
  
    const [apiResponse, setApiResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responseGotten, setResponseGotten] = useState(true);
  
    const handleClick = (element) => {
      element((prev) => !prev);
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async () => {
      const { Name, Price } = formData;
  
      if (!Name || !Price) {
        alert("Please fill in all fields");
        return;
      }
  
      const newFormData = { Name, Price };
  
      setResponseGotten(false);
      await AddReserveTime(newFormData);
      setResponseGotten(true);
  
      handleClick(PopupAddReserveTimeActive);
      setFormData({ Name: "", Price: "" });
  
      console.log("Submitted Add Reserve Time:", newFormData);
    };
  
    useEffect(() => {
      const loadPowerBanks = async () => {
        const result = await GetPowerBank();
        setApiResponse(result);
        setLoading(false);
      };
  
      loadPowerBanks();
    }, []);
  
    return (
      <section className={PopupAddReserveTimeSetActive ? "popup active" : "popup"}>
        <section className="content">
          <h1>
            Add Reserve Time
            <img
              src="../assets/images/close-square.svg"
              alt="close"
              onClick={() => handleClick(PopupAddReserveTimeActive)}
            />
          </h1>
  
          {loading && <p>Loading...</p>}
  
          <label>
            Select PowerBank
            <select
              name="Name"
              value={formData.Name}
              onChange={handleChange}
            >
              <option value="">Choose PowerBank</option>
              {apiResponse.map((powerBank) => (
                <option value={powerBank.Name} key={powerBank._id}>
                  {powerBank.Name}
                </option>
              ))}
            </select>
          </label>
  
          <label>
            Price
            <input type="number" name="Price" value={formData.Price} onChange={handleChange} />
          </label>
  
          <br />
          <button className={responseGotten ? "" : "notActive"} onClick={handleSubmit}>
            Send
          </button>
        </section>
      </section>
    );
  };
  
const ReserveTime = ({ IsEditReserveTimeActive, IsAddReserveTimeActive, FormData }) => {
  const [apiResponse, setApiResponse] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClick = (data, toggle) => {
    toggle((prev) => !prev);
    if (data) FormData(data);
  };

  useEffect(() => {
    const loadData = async () => {
      const result = await GetReserveTime();
      setApiResponse(result || []);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <section className="boxed_container">
      <h1>
        Reserve Time (h)
        <img src="/assets/images/add-b.svg" alt="add" onClick={() => handleClick(null, IsAddReserveTimeActive)} />
      </h1>

      {loading && <p>Loading...</p>}

      {apiResponse.length < 1 && !loading ? (
        <h2 className="info">
          Please, there is no reserve time. Click the add button to add one.
        </h2>
      ) : (
        <section className="more">
          {apiResponse.map((item) => (
            <div key={item._id} onClick={() => handleClick(item, IsEditReserveTimeActive)}>
              <h2>{item.Name}</h2>
              <p>
                {item.Price} <strong>&#8358;</strong>
              </p>
            </div>
          ))}
        </section>
      )}
    </section>
  );
};
  

  
const Components = () => {
    const [editedFormData, setEditedFormData] = useState({});
    const [editPowerBank, setEditPowerBank] = useState(false);
    const [addPowerBank, setAddPowerBank] = useState(false);
  

    
  const [editLateReturn, setEditLateReturn] = useState(false);
  const [addLateReturn, setAddLateReturn] = useState(false);

  const [editReserveTime, setEditReserveTime] = useState(false);
  const [addReserveTime, setAddReserveTime] = useState(false);

    return (
      <main>
        <PopupEditPowerBank
        PopupEditPowerBankActive={setEditPowerBank} 
        PopupEditPowerBankSetActive ={editPowerBank}
        FormData ={editedFormData}
        />
        <PopupAddPowerBank
        PopupAddPowerBankActive={setAddPowerBank} 
        PopupAddPowerBankSetActive ={addPowerBank}
        />
        <PowerBanks
          FormData={setEditedFormData}
          IsEditPowerBankActive={setEditPowerBank}
          IsAddPowerBankActive={setAddPowerBank}
        />

    <PopupEditLateReturnPrice
        PopupEditLateReturnPriceActive={setEditLateReturn}
        PopupEditLateReturnPriceSetActive={editLateReturn}
        FormData={editedFormData}
      />
      <PopupAddLateReturnPrice
        PopupAddLateReturnPriceActive={setAddLateReturn}
        PopupAddLateReturnPriceSetActive={addLateReturn}
      />
      <LateReturnPrice
        FormData={setEditedFormData}
        IsEditLateReturnPriceActive={setEditLateReturn}
        IsAddLateReturnPriceActive={setAddLateReturn}
      />


<PopupEditReserveTime
        PopupEditReserveTimeActive={setEditReserveTime}
        PopupEditReserveTimeSetActive={editReserveTime}
        FormData={editedFormData}
      />
      <PopupAddReserveTime
        PopupAddReserveTimeActive={setAddReserveTime}
        PopupAddReserveTimeSetActive={addReserveTime}
      />
      <ReserveTime
        FormData={setEditedFormData}
        IsEditReserveTimeActive={setEditReserveTime}
        IsAddReserveTimeActive={setAddReserveTime}
      />

       </main>

    );
}

export {Components};
