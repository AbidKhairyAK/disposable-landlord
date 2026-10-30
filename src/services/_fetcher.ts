import api from "./_api";

async function fetcher ( url:string ) {
	return api.get(url).then(res => res.data).catch((error)=>{
		throw error?.response?.data?.error || error?.response?.data || error?.message || error
	})
}

export default fetcher