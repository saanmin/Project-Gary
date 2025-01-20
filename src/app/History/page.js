import { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";

const HistoryPage = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const storedSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    setSubmissions(storedSubmissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Submission History</h1>
        <Button 
          variant="outline" 
          onClick={() => setSubmissions([])}
          className="hidden sm:block"
        >
          Clear History
        </Button>
      </div>
      <div className="space-y-6">
        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No submissions yet</p>
          </div>
        ) : (
          submissions.map(submission => (
            <div
              key={submission.id}
              className="bg-card p-6 rounded-lg shadow-sm border"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{submission.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{submission.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Message</p>
                  <p className="font-medium">{submission.message}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Submitted at</p>
                  <p className="font-medium">
                    {new Date(submission.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Button 
        variant="outline" 
        onClick={() => setSubmissions([])}
        className="w-full mt-6 sm:hidden"
      >
        Clear History
      </Button>
    </div>
  );
};

export default HistoryPage;
