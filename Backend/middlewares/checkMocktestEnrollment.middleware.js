const checkMockTestEnrollment = async (req, res) =>{
    // check if the user is enrolled in this mocktest bundle
    const user = req.user;
    const {bundleId} = req.params;
}