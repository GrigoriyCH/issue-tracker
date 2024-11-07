'use strict';

let issues = []; // Array to store issues in memory

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res) {
      const project = req.params.project;
      const filters = req.query;

      // Filter issues by project and any query parameters
      const filteredIssues = issues.filter(issue => {
        if (issue.project !== project) return false;
        for (let key in filters) {
          if (issue[key] !== filters[key]) return false;
        }
        return true;
      });

      res.json(filteredIssues);
    })
    
    .post(function (req, res) {
      const project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      // Check for required fields
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      // Create a new issue object
      const newIssue = {
        _id: new Date().getTime().toString(), // Simple unique ID based on timestamp
        project,
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        open: true,
        created_on: new Date(),
        updated_on: new Date()
      };

      // Add the issue to the array
      issues.push(newIssue);
      res.json(newIssue);
    })
    
    .put(function (req, res) {
      const { _id, ...fieldsToUpdate } = req.body;
    
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      
      if (Object.keys(fieldsToUpdate).length === 0) {
        return res.json({ error: 'no update field(s) sent', _id });
      }
    
      const issue = issues.find(issue => issue._id === _id);
      if (!issue) {
        console.log("Issue not found, could not update:", _id); // Log if the issue is not found
        return res.json({ error: 'could not update', _id });
      }
    
      // Update fields and updated_on timestamp
      for (let key in fieldsToUpdate) {
        if (key !== '_id') issue[key] = fieldsToUpdate[key];
      }
      issue.updated_on = new Date();
    
      console.log("Successfully updated issue:", _id); // Log success
      res.json({ result: 'successfully updated', _id });
    })
    
    .delete(function (req, res) {
      const { _id } = req.body;
    
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
    
      const index = issues.findIndex(issue => issue._id === _id);
      if (index === -1) {
        console.log("Issue not found, could not delete:", _id); // Log if the issue is not found
        return res.json({ error: 'could not delete', _id });
      }
    
      issues.splice(index, 1); // Remove issue from array
    
      console.log("Successfully deleted issue:", _id); // Log success
      res.json({ result: 'successfully deleted', _id });
    });
};