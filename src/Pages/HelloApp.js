import React from "react";
import Button from "@leafygreen-ui/button";
import Card from '@leafygreen-ui/card';
import { Option, Select } from '@leafygreen-ui/select';
import Icon from '@leafygreen-ui/icon';
import { Stepper, Step } from '@leafygreen-ui/stepper';
import { AtlasLogoLockup } from '@leafygreen-ui/logo';
import { H1, Subtitle } from '@leafygreen-ui/typography';
import { useRealmApp } from "../RealmApp";
import Container from "../Components/Container";
import axios from "axios";

const HelloApp = () => {
    const app = useRealmApp();
    const token = app.currentUser.accessToken;
    axios.defaults.headers.common['Authorization'] = `Baerer ${token}`

    const [clusters, setClusters] = React.useState([]);
    const [snapshots, setSnapshots] = React.useState([]);
    const [snapshotId, setSnapshotId] = React.useState(null);
    const [currentStep, setCurrentStep] = React.useState(0);

    React.useEffect(() => {
        axios.get("/get_clusters").then((response) => {
            setClusters(response.data);
        });
    }, []);

    const selectCluster = (clusterName) => {
        setCurrentStep(1);
        axios.get(`/get_snapshots?cluster=${clusterName}`).then((response) => {
            setSnapshots(response.data);
        });
    }

    const selectSnapshot = (snapshotId) => {
        setCurrentStep(2);
        setSnapshotId(snapshotId);
    }

    return (
        <div style={{margin: 20}}>
            <AtlasLogoLockup />
            <H1>Create Test Database</H1>
            <Stepper currentStep={currentStep} maxDisplayedSteps={5}>
                    <Step>Select Source</Step>
                    <Step>Select Snapshot</Step>
                    <Step>Create Target Test Cluster</Step>
                    <Step>Restore Snapshot to Target</Step>
                    <Step>Ready to connect</Step>
                </Stepper>

            <Container>
                <Card className="card">
                    <Select
                        onChange={(value) => selectCluster(value)}
                        label="Source Cluster"
                        description="From this cluster you can select any snapshot made and restore it in a new created cluster for development purpose"
                        placeholder="Please select source cluster"
                    >
                        {clusters.map(cluster => <Option key={ cluster.name } value={ cluster.name }>{`${cluster.name} / ${cluster.tier} / ${cluster.version}`}</Option>)}
                    </Select>
                </Card >
                {snapshots.length > 0 ?
                    <Card className="card">
                        <Select
                            onChange={(value) => selectSnapshot(value)}
                        >
                            {snapshots.map(snapshot =>
                                <Option
                                    key={snapshot.id}
                                    value={snapshot.id}
                                >
                                    {`${snapshot.createdAt} / ${snapshot.version}`}
                                </Option>)}
                        </Select>
                    </Card> :
                    null
                }
                {snapshotId ?
                    <Button
                        style={{ marginTop: 20, alignItems: "flex-start" }}
                        variant="primaryOutline"
                        leftGlyph={<Icon glyph="Play" />}
                    >Restore Snapshot</Button> :
                    null
                }
            </Container>
            <Subtitle>{`User: ${app.currentUser._profile.data.email}`}</Subtitle>
            <Button variant="primary" onClick={() => app.logOut()}>Logout</Button>
        </div>
    );
}

export default HelloApp;