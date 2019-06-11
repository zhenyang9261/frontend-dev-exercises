### RTI CDS Frontend Developer Exercise Submission 

This submission contains two folders. The implemenation in "vue" folder is the final deliverable. The implementation in "d3" folder was built in an early trial stage, but is still a fully executable version. Below are the instructions to run.  

----

### Vue 

It is assumed that Vue is installed on the computer already. If Vue is not installed, please refer to [Vue Installatioin](https://vuejs.org/v2/guide/installation.html) to install Vue.js. 
1. Open up a git bash in a location of your choice.
2. Create a project: vue create census (census is the name of the project) 
3. Enter the project folder: cd census
4. Install D3: npm install --save d3.
5. From this repository, copy all files under "submission/vue" to the "census" folder created in step 2.  
6. Run local http server from "census" folder: npm run serve
7. Open up a browser, go to http://localhost:8080

----

### D3

It is assumed that Python is installed on the computer and can run local http server. Please visit [Running a simple local HTTP server](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server) for reference.
1. Open up a git bash in the local repository folder.
2. Enter folder: cd submission/d3 
3. Run local http server: python -m http.server 8000
4. Open up a browser, go to http://localhost:8000
----
