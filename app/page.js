'use client'
import { useState } from 'react';
import axios from 'axios';
import { GrYoutube } from "react-icons/gr";
import { PropagateLoader  } from 'react-spinners';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Home() {
  const [url, setChannelUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [channel, setChannel] = useState('');
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setData([]);
    console.log(url);
    let regex = /^(https?:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/[^\/]*\/?$/;
    if (!regex.test(url)) {
      toast.error("Invalid YouTube link!");
      return;
    }
    const channelName = url.split('/')[3].slice(1);
    setChannel(channelName);
    const sanitizedUrl = url.replace(/\/$/, '') + '/videos';
    setLoading(true);

    // const response = await axios.post('/api/extract-video-data', { url: sanitizedUrl });
    // console.log(response.data.formattedResult);
    // setData(response.data.formattedResult);
    // setLoading(false);

    try {
      const response = await axios.post('/api/extract-video-data', { url: sanitizedUrl });
      console.log(response.data.formattedResult);
      setData(response.data.formattedResult);
      toast.success("Data successfully scraped!");
    } catch (error) {
      toast.error("Failed to scrape data!");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const createAndDownloadCSV = () => {
    const csvData = Papa.unparse(data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    saveAs(blob, `${channel}.csv`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <ToastContainer />
     <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
       <div className="mb-4">

         <div className='flex items-center justify-center'>
          <GrYoutube color='red' size={60} />
         </div>

         <label className="block text-gray-700 text-base font-bold mb-6 text-center" htmlFor="url">
           YouScrape
         </label>

         <input
           className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
           id="url"
           type="url"
           value={url}
           onChange={(e) => setChannelUrl(e.target.value)}
           placeholder="Enter YouTube channel link"
         />

       </div>

       <div className="flex items-center justify-between w-full">
         <button className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">
           Extract Data
         </button>
       </div>

        {
          loading 
          && 
          <div className='flex justify-center my-6'>
            <PropagateLoader   color="#3b82f6" size={8} />
          </div>
        }

        {
          (data.length > 0 && loading == false)
          &&
          <div className="flex items-center justify-between w-full my-6">
            <button type='button' onClick={createAndDownloadCSV} className="flex justify-center text-sm bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
              <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
              Download CSV
            </button>
          </div>
        }

      </form>
      <div className="text-xs p-3 text-slate-800">
        <p>© 2023 Secretgfx</p>
      </div>
    </div>
    );
}