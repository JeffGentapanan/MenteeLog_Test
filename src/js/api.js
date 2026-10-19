// Production integration adapter. Demo UI currently uses the local data store.
// Mount your authenticated API at /api/v1 and replace demo repository operations.
export class ApiError extends Error {constructor(message,status){super(message);this.name='ApiError';this.status=status;}}
export function createApiClient({baseUrl='/api/v1',csrfToken=()=>null,fetcher=globalThis.fetch}={}) {
  if(!/^\/[a-zA-Z0-9/_-]*$/.test(baseUrl)||baseUrl.startsWith('//'))throw new Error('Use a same-origin API path.');
  async function request(path,{method='GET',body,signal}={}) {
    const headers={Accept:'application/json'};
    if(body && !(body instanceof FormData))headers['Content-Type']='application/json';
    if(!['GET','HEAD'].includes(method)){const token=csrfToken();if(!token)throw new ApiError('A server-issued CSRF token is required.',403);headers['X-CSRF-Token']=token;}
    let response;
    try {response=await fetcher(baseUrl+path,{method,credentials:'same-origin',headers,body:body instanceof FormData?body:body?JSON.stringify(body):undefined,signal:signal||AbortSignal.timeout(15000)});}
    catch(error){throw new ApiError(error.name==='TimeoutError'?'The request timed out. Please try again.':'Unable to reach the server.',0);}
    if(response.status===204)return null;
    const data=await response.json().catch(()=>null);
    if(!response.ok)throw new ApiError(data?.message||'The request could not be completed.',response.status);
    return data;
  }
  const resource = path => ({list:()=>request(path),get:id=>request(path+'/'+encodeURIComponent(id)),create:body=>request(path,{method:'POST',body}),update:(id,body)=>request(path+'/'+encodeURIComponent(id),{method:'PATCH',body})});
  return {request,auth:{session:()=>request('/auth/session'),login:body=>request('/auth/login',{method:'POST',body}),logout:()=>request('/auth/logout',{method:'POST'}),forgot:body=>request('/auth/forgot-password',{method:'POST',body}),reset:body=>request('/auth/reset-password',{method:'POST',body})},jobs:resource('/jobs'),applications:resource('/applications'),dtr:resource('/dtr'),appraisals:resource('/appraisals'),incidents:resource('/incidents'),meetings:resource('/meetings'),users:resource('/users'),notifications:resource('/notifications'),htes:resource('/htes'),documents:resource('/documents'),reports:resource('/reports')};
}
export const api=createApiClient();

